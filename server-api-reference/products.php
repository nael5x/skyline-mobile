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

function text_contains($haystack, $needle) {
    if ($needle === '') {
        return true;
    }

    return stripos((string)$haystack, (string)$needle) !== false;
}

function item_matches_search($item, $search) {
    if ($search === '') {
        return true;
    }

    $fields = [
        $item['code'] ?? '',
        $item['category'] ?? '',
        $item['category_tr'] ?? '',
        $item['name'] ?? '',
        $item['name_ar'] ?? '',
        $item['name_tr'] ?? '',
        $item['description'] ?? '',
        $item['description_ar'] ?? '',
        $item['description_tr'] ?? '',
    ];

    foreach ($fields as $field) {
        if (text_contains($field, $search)) {
            return true;
        }
    }

    return false;
}

function item_matches_category($item, $category) {
    if ($category === '') {
        return true;
    }

    return ($item['category'] ?? '') === $category || ($item['category_tr'] ?? '') === $category;
}

function cleanup_item($item) {
    unset($item['_sort_id']);
    unset($item['_created_ts']);
    return $item;
}

try {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(1000, max(1, (int)$_GET['limit'])) : 500;
    $offset = ($page - 1) * $limit;

    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'latest';

    $items = [];

    /*
     * 1) Products table
     */
    $productsSql = "
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
        WHERE type IN ('direct', 'manufactured')
    ";

    $productsStmt = $conn->prepare($productsSql);
    $productsStmt->execute();
    $productRows = $productsStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($productRows as $row) {
        $imagePath = $row['image_path'] ?: $row['image'];
        $createdAt = $row['created_at'];

        $item = [
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
            'created_at' => $createdAt,

            '_sort_id' => (int)$row['id'],
            '_created_ts' => $createdAt ? strtotime($createdAt) : 0,
        ];

        if (item_matches_search($item, $search) && item_matches_category($item, $category)) {
            $items[] = $item;
        }
    }

    /*
     * 2) Store catalog table
     */
    if (table_exists($conn, 'store_catalog')) {
        $columns = get_columns($conn, 'store_catalog');

        if (has_column($columns, 'id')) {
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

            $catalogSql = "
                SELECT
                    " . implode(",\n                    ", $select) . "
                FROM store_catalog
            ";

            $catalogStmt = $conn->prepare($catalogSql);
            $catalogStmt->execute();
            $catalogRows = $catalogStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($catalogRows as $row) {
                if (isset($row['is_active']) && $row['is_active'] !== null && (int)$row['is_active'] !== 1) {
                    continue;
                }

                $catalogId = (int)$row['id'];
                $galleryFirst = first_gallery_image($row['gallery_images'] ?? null);
                $imagePath = $row['image_path'] ?: $galleryFirst;

                $categoryAr = $row['category'] ?: 'المستلزمات والماكينات';
                $categoryTr = $row['category_tr'] ?: 'Malzeme ve Makineler';

                $nameAr = $row['title'] ?: $row['title_tr'] ?: 'منتج';
                $nameTr = $row['title_tr'] ?: $row['title'] ?: 'Ürün';

                $descriptionAr = $row['description'] ?: '';
                $descriptionTr = $row['description_tr'] ?: '';

                $createdAt = $row['created_at'] ?? null;

                $item = [
                    'id' => 'catalog-' . $catalogId,
                    'source' => 'store_catalog',

                    'code' => $row['code'] ?: ('CAT-' . $catalogId),
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
                    'created_at' => $createdAt,

                    '_sort_id' => $catalogId,
                    '_created_ts' => $createdAt ? strtotime($createdAt) : 0,
                ];

                if (item_matches_search($item, $search) && item_matches_category($item, $category)) {
                    $items[] = $item;
                }
            }
        }
    }

    /*
     * Sort merged results
     */
    usort($items, function ($a, $b) use ($sort) {
        switch ($sort) {
            case 'price_asc':
                return ((float)$a['price']) <=> ((float)$b['price']);

            case 'price_desc':
                return ((float)$b['price']) <=> ((float)$a['price']);

            case 'name':
                return strcmp((string)$a['name'], (string)$b['name']);

            case 'latest':
            default:
                $timeCompare = ((int)$b['_created_ts']) <=> ((int)$a['_created_ts']);

                if ($timeCompare !== 0) {
                    return $timeCompare;
                }

                return ((int)$b['_sort_id']) <=> ((int)$a['_sort_id']);
        }
    });

    $total = count($items);
    $pagedItems = array_slice($items, $offset, $limit);
    $pagedItems = array_map('cleanup_item', $pagedItems);

    api_response([
        'items' => $pagedItems,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $limit > 0 ? ceil($total / $limit) : 1
        ]
    ]);
} catch (Throwable $e) {
    error_log('Products API failed: ' . $e->getMessage());
    api_error('Products API failed', 500);
}