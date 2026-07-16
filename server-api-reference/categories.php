<?php
require_once __DIR__ . '/_bootstrap.php';

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

function add_category(&$categories, $nameAr, $nameTr, $count = 1) {
    $nameAr = trim((string)$nameAr);
    $nameTr = trim((string)$nameTr);

    if ($nameAr === '') {
        $nameAr = 'منتجات أخرى';
    }

    if ($nameTr === '') {
        $nameTr = $nameAr;
    }

    $key = $nameAr . '|' . $nameTr;

    if (!isset($categories[$key])) {
        $categories[$key] = [
            'id' => $nameAr,
            'name' => $nameAr,
            'name_ar' => $nameAr,
            'name_tr' => $nameTr,
            'products_count' => 0,
        ];
    }

    $categories[$key]['products_count'] += (int)$count;
}

try {
    $categories = [];

    /*
     * 1) Categories from products table
     */
    $sql = "
        SELECT
            category,
            category_tr,
            COUNT(*) AS products_count
        FROM products
        WHERE type IN ('direct', 'manufactured')
        GROUP BY category, category_tr
        ORDER BY category ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $productCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($productCategories as $row) {
        add_category(
            $categories,
            $row['category'] ?? 'منتجات أخرى',
            $row['category_tr'] ?? ($row['category'] ?? 'منتجات أخرى'),
            (int)($row['products_count'] ?? 0)
        );
    }

    /*
     * 2) Categories from store_catalog table
     */
    if (table_exists($conn, 'store_catalog')) {
        $columns = get_columns($conn, 'store_catalog');

        if (has_column($columns, 'id')) {
            $select = [
                qcol('id') . " AS id",
                select_alias($columns, ['category', 'category_ar'], 'category'),
                select_alias($columns, ['category_tr'], 'category_tr'),
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

                $categoryAr = $row['category'] ?: 'المستلزمات والماكينات';
                $categoryTr = $row['category_tr'] ?: 'Malzeme ve Makineler';

                add_category($categories, $categoryAr, $categoryTr, 1);
            }
        }
    }

    $items = array_values($categories);

    usort($items, function ($a, $b) {
        return strcmp((string)$a['name'], (string)$b['name']);
    });

    api_response([
        'items' => $items,
        'total' => count($items),
    ]);
} catch (Throwable $e) {
    error_log('Categories API failed: ' . $e->getMessage());
    api_error('Categories API failed', 500);
}