<?php

include 'credenciales.php';

// Función para obtener datos de la tabla de categorías en formato JSON
function obtenerCategorias($conn) {
    $sql = "SELECT cl.name, c.id_category 
            FROM ps_category_lang cl
            INNER JOIN ps_category c ON cl.id_category = c.id_category";

    $resultados = $conn->query($sql);

    $categorias = array();

    while ($fila = $resultados->fetch_assoc()) {
        $categoria = array(
            'id' => $fila['id_category'],
            'name' => $fila['name']
        );

        $sql_cont = "SELECT COUNT(p.id_product) AS product_con
                    FROM ps_product p 
                    WHERE p.id_category_default = " . $fila["id_category"];
        
        $resultados2 = $conn->query($sql_cont);
        $productCon = $resultados2->fetch_assoc();
        
        $categoria['productCon'] = $productCon['product_con'];

        $categorias[] = $categoria;
    }

    return json_encode($categorias);
}

// Función para obtener datos de la subtabla de productos en formato JSON
function obtenerSubtablaProductos($conn, $category_id) {
    $sql_subtable = "SELECT pl.name AS nombre_producto, COUNT(fp.id_feature) AS contador_caracteristicas, P.id_product AS id_producto
                    FROM ps_product_lang AS pl
                    INNER JOIN ps_product AS p ON pl.id_product = p.id_product
                    LEFT JOIN ps_feature_product AS fp ON p.id_product = fp.id_product
                    WHERE p.id_category_default = $category_id
                    GROUP BY pl.name";

    $result_subtable = $conn->query($sql_subtable);

    $subtableData = array();

    if ($result_subtable->num_rows > 0) {
        while ($row = $result_subtable->fetch_assoc()) {
            $subtableData[] = array(
                'id_producto' => $row['id_producto'],
                'nombre_producto' => $row['nombre_producto'],
                'contador_caracteristicas' => $row['contador_caracteristicas']
            );
        }
    }

    return json_encode($subtableData);
}

// Función para obtener detalles de características del producto
function obtenerDetallesCaracteristicas($conn, $idProducto) {
    $sql_caracteristicas = "SELECT fl.name AS caracteristicas
                            FROM ps_feature_lang AS fl
                            INNER JOIN ps_feature_product AS fp ON fl.id_feature = fp.id_feature
                            WHERE fp.id_product = $idProducto";

    $result_caracteristicas = $conn->query($sql_caracteristicas);

    $caracteristicas = array();

    if ($result_caracteristicas->num_rows > 0) {
        while ($row = $result_caracteristicas->fetch_assoc()) {
            $caracteristicas[] = array(
                'caracteristicas' => $row['caracteristicas']
            );
        }
        echo json_encode($caracteristicas);
    } else {
        echo json_encode(array('message' => 'No se encontraron características para este producto.'));
    }
}

// Verificar si se ha recibido un ID por GET
if (isset($_GET['id'])) {
    $category_id = $_GET['id'];

    // Obtener datos de la subtabla de productos según el ID recibido
    echo obtenerSubtablaProductos($conn, $category_id);
} else if (isset($_GET['idProducto'])) {
    $idProducto = $_GET['idProducto'];

    // Obtener detalles de características del producto según el ID recibido
    obtenerDetallesCaracteristicas($conn, $idProducto);
} else {
    // En caso de no recibir un ID, se devuelven los datos de la tabla de categorías
    echo obtenerCategorias($conn);
}
?>
