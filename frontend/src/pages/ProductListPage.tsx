import React, { useState, useEffect } from "react";
import apiClient from "../services/api";
import type { IProduct } from "../types/interfaces"; // Tu interfaz IProduct

// --- Importaciones de PrimeReact ---
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button"; // --- NUEVO ---
import { Dialog } from "primereact/dialog"; // --- NUEVO ---

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- NUEVO: Estados para el Dialog de Atributos ---
  const [isAttributesDialogVisible, setIsAttributesDialogVisible] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<IProduct[]>("/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- TEMPLATES PARA FORMATEAR CELDAS ---

  const priceBodyTemplate = (rowData: IProduct) => {
    return rowData.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // --- NUEVO: Funciones para abrir/cerrar el dialog de atributos ---
  const openAttributesDialog = (product: IProduct) => {
    setSelectedProduct(product);
    setIsAttributesDialogVisible(true);
  };

  const hideAttributesDialog = () => {
    setIsAttributesDialogVisible(false);
    setSelectedProduct(null); // Limpia el producto seleccionado
  };

  // --- MODIFICADO: El template de atributos ahora es un botón ---
  const attributesBodyTemplate = (rowData: IProduct) => {
    const hasAttributes =
      rowData.attributes && Object.keys(rowData.attributes).length > 0;

    if (!hasAttributes) {
      return <span className="text-gray-400">N/A</span>;
    }

    // Si tiene atributos, muestra un botón
    return (
      <Button
        label="Ver"
        icon="pi pi-eye"
        outlined
        size="small" // Un botón pequeño queda mejor en la tabla
        onClick={() => openAttributesDialog(rowData)}
      />
    );
  };

  const descriptionBodyTemplate = (rowData: IProduct) => {
    return (
      <p title={rowData.description} className="max-w-xs truncate">
        {rowData.description}
      </p>
    );
  };

  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message severity="error" text={error} />
      </div>
    );
  }

  return (
    // 'card' es de PrimeReact, 'm-4' y 'shadow-lg' son de Tailwind
    <div className="card m-4 shadow-lg border rounded-lg overflow-hidden">
      <DataTable
        value={products}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
        dataKey="_id"
        header={<h1 className="text-2xl font-bold">Lista de Productos</h1>}
        emptyMessage="No se encontraron productos."
        className="p-datatable-gridlines"
      >
        <Column
          field="name"
          header="Nombre"
          sortable
          className="min-w-[12rem]"
        />
        <Column
          field="description"
          header="Descripción"
          body={descriptionBodyTemplate}
          className="min-w-[15rem]"
        />
        <Column
          field="price"
          header="Precio"
          body={priceBodyTemplate}
          sortable
        />
        <Column field="stock" header="Stock" sortable />
        <Column
          field="category"
          header="Categoría"
          sortable
          className="min-w-[10rem]"
        />
        <Column
          field="attributes"
          header="Atributos"
          body={attributesBodyTemplate} // <-- Este es el template modificado
          className="min-w-[6rem] text-center"
        />
      </DataTable>

      {/* --- NUEVO: El componente Dialog que está oculto por defecto --- */}
      <Dialog
        visible={isAttributesDialogVisible}
        onHide={hideAttributesDialog}
        // Muestra el nombre del producto en el encabezado
        header={`Atributos de: ${selectedProduct?.name || ""}`}
        modal
        style={{ width: "30rem" }}
        className="p-4"
      >
        {selectedProduct && selectedProduct.attributes ? (
          // Muestra los atributos como una lista de key-value
          <div className="p-2">
            <ul className="list-disc pl-5 space-y-2">
              {Object.entries(selectedProduct.attributes).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong className="font-semibold text-gray-800 capitalize">
                      {key}:
                    </strong>
                    <span className="ml-2 text-gray-700">{String(value)}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <p>No hay atributos para mostrar.</p>
        )}
      </Dialog>
    </div>
  );
};

export default ProductListPage;
