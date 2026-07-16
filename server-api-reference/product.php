<?php
require_once __DIR__ . '/_bootstrap.php';

function get_base_url() {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'skylinegroup-sy.com';
    return $scheme . '://' . $host . '/';
}

function image_url($path) {
    if (!$path) {
        return null;
    }

    if (preg_match('/^https?:\/\//i', $path)) {
        return $path;
    }

    return rtrim(get_base_url(), '/') . '/' . ltrim($path, '/');
}

function decode_json_field($value) {
    if (!$value) {
        return null;
    }

    if (is_array($value)) {
        return $value;
    }

    $decoded = json_decode($value, true);
    return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
}

function first_gallery_image($value) {
    if (!$value) {
        return null;
    }

    $decoded = json_decode($value, true);

    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        foreach ($decoded as $item) {
            if (is_string($item) && trim($item) !== '') {
                return $item;
            }

            if (is_array($item)) {
                foreach (['url', 'path', 'image', 'image_path'] as $key) {
                    if (!empty($item[$key])) {
                        return $item[$key];
                    }
                }
            }
        }
    }

    if (is_string($value) && trim($value) !== '') {
        $parts = explode(',', $value);
        return trim($parts[0]);
    }

    return null;
}

function table_exists(PDO $conn, $table) {
    try {
        $stmt = $conn->query("SHOW TABLES LIKE " . $conn->quote($table));
        return (bool)$stmt->fetchColumn();
    } catch (Throwable $e) {
        return false;
    }
}

function get_columns(PDO $conn, $table) {
    try {
        $stmt = $conn->query("SHOW COLUMNS FROM `" . str_replace('`', '', $table) . "`");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $columns = [];
        foreach ($rows as $row) {
            $columns[] = $row['Field'];
        }

        return $columns;
    } catch (Throwable $e) {
        return [];
    }
}

function has_column($columns, $name) {
    return in_array($name, $columns, true);
}

function pick_column($columns, $names) {
    foreach ($names as $name) {
        if (has_column($columns, $name)) {
            return $name;
        }
    }

    return null;
}

function qcol($column) {
    return "`" . str_replace("`", "", $column) . "`";
}

function select_alias($columns, $possibleNames, $alias) {
    $column = pick_column($columns, $possibleNames);

    if ($column) {
        return qcol($column) . " AS " . qcol($alias);
    }

    return "NULL AS " . qcol($alias);
}

try {
    $id = isset($_GET['id']) ? trim($_GET['id']) : '';

    if ($id === '') {
        api_error('Product id is required', 400);
    }

    /*
     * store_catalog product
     * id format: catalog-123
     */
    if (strpos($id, 'catalog-') === 0) {
        $catalogId = (int)str_replace('catalog-', '', $id);

        if ($catalogId <= 0) {
            api_error('Invalid catalog product id', 400);
        }

        if (!table_exists($conn, 'store_catalog')) {
            api_error('Catalog table not found', 404);
        }

        $columns = get_columns($conn, 'store_catalog');

        if (!has_column($columns, 'id')) {
            api_error('Catalog id column not found', 500);
        }

        $select = [
            qcol('id') . " AS id",
            select_alias($columns, ['code', 'sku', 'model', 'slug'], 'code'),
            select_alias($columns, ['category', 'category_ar'], 'category'),
            select_alias($columns, ['category_tr'], 'category_tr'),
            select_alias($columns, ['title', 'name', 'title_ar', 'name_ar'], 'title'),
            select_alias($columns, ['title_tr', 'name_tr'], 'title_tr'),
            select_alias($columns, ['short_desc', 'description', 'desc', 'description_ar'], 'description'),
            select_alias($columns, ['short_desc_tr', 'description_tr', 'desc_tr'], 'description_tr'),
            select_alias($columns, ['price', 'default_price'], 'price'),
            select_alias($columns, ['tax_rate', 'vat_rate'], 'tax_rate'),
            select_alias($columns, ['image_path', 'image', 'thumbnail', 'main_image'], 'image_path'),
            select_alias($columns, ['gallery_images', 'images'], 'gallery_images'),
            select_alias($columns, ['created_at', 'created'], 'created_at'),
            select_alias($columns, ['is_active', 'active'], 'is_active'),
        ];

        $sql = "
            SELECT
                " . implode(",\n                ", $select) . "
            FROM store_catalog
            WHERE id = :id
            LIMIT 1
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $catalogId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            api_error('Product not found', 404);
        }

        if (isset($row['is_active']) && $row['is_active'] !== null && (int)$row['is_active'] !== 1) {
            api_error('Product not found', 404);
        }

        $galleryFirst = first_gallery_image($row['gallery_images'] ?? null);
        $imagePath = $row['image_path'] ?: $galleryFirst;

        $categoryAr = $row['category'] ?: 'المستلزمات والماكينات';
        $categoryTr = $row['category_tr'] ?: 'Malzeme ve Makineler';

        $nameAr = $row['title'] ?: $row['title_tr'] ?: 'منتج';
        $nameTr = $row['title_tr'] ?: $row['title'] ?: 'Ürün';

        $descriptionAr = $row['description'] ?: '';
        $descriptionTr = $row['description_tr'] ?: '';

        api_response([
            'id' => 'catalog-' . (int)$row['id'],
            'source' => 'store_catalog',

            'code' => $row['code'] ?: ('CAT-' . (int)$row['id']),
            'category' => $categoryAr,
            'category_tr' => $categoryTr,

            'name' => $nameAr,
            'name_ar' => $nameAr,
            'name_tr' => $nameTr,

            'description' => $descriptionAr,
            'description_ar' => $descriptionAr,
            'description_tr' => $descriptionTr,

            'price' => (float)($row['price'] ?? 0),
            'tax_rate' => (float)($row['tax_rate'] ?? 0),
            'type' => 'store_catalog',

            'image_path' => $imagePath,
            'image_url' => image_url($imagePath),

            'specifications' => [
                'source' => 'store_catalog',
                'gallery_images' => decode_json_field($row['gallery_images'] ?? null),
            ],

            'created_at' => $row['created_at'] ?? null,
        ]);

        return;
    }

    /*
     * normal products table
     */
    $productId = (int)$id;

    if ($productId <= 0) {
        api_error('Invalid product id', 400);
    }

    $sql = "
        SELECT
            id,
            code,
            category,
            category_tr,
            product_name,
            product_name_tr,
            description,
            description_tr,
            specifications,
            image_path,
            image,
            type,
            default_price,
            tax_rate,
            created_at
        FROM products
        WHERE id = :id
          AND type IN ('direct', 'manufactured')
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':id', $productId, PDO::PARAM_INT);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        api_error('Product not found', 404);
    }

    $imagePath = $row['image_path'] ?: $row['image'];

    api_response([
        'id' => (int)$row['id'],
        'source' => 'products',

        'code' => $row['code'],
        'category' => $row['category'],
        'category_tr' => $row['category_tr'],

        'name' => $row['product_name'],
        'name_ar' => $row['product_name'],
        'name_tr' => $row['product_name_tr'],

        'description' => $row['description'],
        'description_ar' => $row['description'],
        'description_tr' => $row['description_tr'],

        'price' => (float)$row['default_price'],
        'tax_rate' => (float)$row['tax_rate'],
        'type' => $row['type'],

        'image_path' => $imagePath,
        'image_url' => image_url($imagePath),

        'specifications' => decode_json_field($row['specifications']),
        'created_at' => $row['created_at'],
    ]);

    return;
} catch (Throwable $e) {
    error_log('Product API failed: ' . $e->getMessage());
    api_error('Product API failed', 500);
}