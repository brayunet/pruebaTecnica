fetch('tabla.php')
    .then(res => res.json())
    .then(data => {
        let str = '';
        data.forEach(item => {
            const addButton = (item.productCon > 0) ? `<button onclick="obtenerDatos(${item.id})" type="button" class="btn btn-outline-secondary btn-sm">+</button>` : ' ';
            // GENERACION DINAMICA DE LA TABLA DE CATEGORIAS
            str += `
                <tr id="table_data_${item.id}">
                    <td>${addButton}</td>
                    <td>${item.name}</td>
                    <td>${item.productCon}</td>
                </tr>
                <tr class="details-row" id="detailsRow_${item.id}" style="display: none;">
                    <td colspan="3">
                        <div class="bg-white rounded col-xl-12 col-lg-12">
                            <table class="table table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th> </th>
                                        <th>Nombre del Producto</th>
                                        <th>Número de Características</th>
                                    </tr>
                                </thead>
                                <tbody id="details_data_${item.id}"></tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            `;
        });

        document.getElementById('table_data').innerHTML = str;
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

    function obtenerDatos(id) {
        const detailsRow = document.getElementById(`detailsRow_${id}`);
    
        if (detailsRow.style.display === 'table-row') {
            detailsRow.style.display = 'none';
        } else {
            if (id !== "") {
                var xhr = new XMLHttpRequest();
    
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const details = JSON.parse(xhr.responseText);
                            const detailsHTML = details.map(detail => {
                                // GENERACION DINAMICA DE LA SUBTABLA DE PRODUCTOS Y LA SUBTABLA DE CARACTERISTICAS
                                return `
                                    <tr>
                                        <td><button onclick="obtenerDetallesCaracteristicas(${detail.id_producto})" type="button" class="btn btn-outline-secondary btn-sm">+</button></td>
                                        <td>${detail.nombre_producto}</td>
                                        <td>${detail.contador_caracteristicas}</td>
                                    </tr>
                                    <tr class="details-caracteristicas" id="detailsCaracteristicas_${detail.id_producto}" style="display: none;">
                                        <td colspan="3">
                                            <div class=" bg-white rounded col-xl-12 col-lg-12 px-2">
                                                <table class="table table-hover">
                                                    <thead class="table-dark">
                                                        <tr>
                                                            <th>Características</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="caracteristicas_data_${detail.id_producto}"></tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('');
    
                            const detailsContainer = document.getElementById(`details_data_${id}`);
                            detailsContainer.innerHTML = detailsHTML;
    
                            detailsRow.style.display = 'table-row';
                        } else {
                            console.error('Error al obtener datos. Código de estado:', xhr.status);
                        }
                    }
                };
    
                xhr.open('GET', 'tabla.php?id=' + id, true);
                xhr.send();
            } else {
                alert("Por favor ingresa un ID válido.");
            }
        }
    }
    
    function obtenerDetallesCaracteristicas(idProducto) {
        const detallesCaracteristicas = document.getElementById(`detailsCaracteristicas_${idProducto}`);
    
        if (detallesCaracteristicas.style.display === 'table-row') {
            detallesCaracteristicas.style.display = 'none';
        } else {
            if (idProducto !== "") {
                var xhr = new XMLHttpRequest();
    
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const caracteristicas = JSON.parse(xhr.responseText);
                            const caracteristicasHTML = caracteristicas.map(item => {
                                return `
                                    <tr>
                                        <td>${item.caracteristicas}</td>
                                    </tr>
                                `;
                            }).join('');
    
                            const caracteristicasContainer = document.getElementById(`caracteristicas_data_${idProducto}`);
                            caracteristicasContainer.innerHTML = caracteristicasHTML;
    
                            detallesCaracteristicas.style.display = 'table-row';
                        } else {
                            console.error('Error al obtener datos de características. Código de estado:', xhr.status);
                        }
                    }
                };
    
                xhr.open('GET', 'tabla.php?idProducto=' + idProducto, true);
                xhr.send();
            } else {
                alert("Por favor ingresa un ID de producto válido.");
            }
        }
    }
    