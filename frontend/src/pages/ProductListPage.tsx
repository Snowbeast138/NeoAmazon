import React, { useState, useEffect, useRef } from "react"; // --- Añadido useRef
import apiClient from "../services/api";
import type { IProduct } from "../types/interfaces"; // Tu interfaz IProduct

// --- Importaciones de PrimeReact ---
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar"; // --- NUEVO ---
import { Toast } from "primereact/toast"; // --- NUEVO ---

import ProductFormDialog from "../components/ProductFormDialog";
import ExpandableDescription from "../components/ExpandableDescription";

const ProductListPage: React.FC = () => {
  // --- Estados Principales ---
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAttributesDialogVisible, setIsAttributesDialogVisible] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isCreateDialogVisible, setIsCreateDialogVisible] =
    useState<boolean>(false);
  const toast = useRef<Toast>(null);

  // --- Carga Inicial de Datos ---
  useEffect(() => {
    fetchProducts();
  }, []);

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

  // --- Funciones para el Dialog de *Ver* Atributos ---
  const openAttributesDialog = (product: IProduct) => {
    setSelectedProduct(product);
    setIsAttributesDialogVisible(true);
  };
  const hideAttributesDialog = () => {
    setIsAttributesDialogVisible(false);
    setSelectedProduct(null);
  };
  const attributesBodyTemplate = (rowData: IProduct) => {
    const hasAttributes =
      rowData.attributes && Object.keys(rowData.attributes).length > 0;
    if (!hasAttributes) {
      return <span className="text-gray-400">N/A</span>;
    }
    return (
      <Button
        label="Ver"
        icon="pi pi-eye"
        outlined
        size="small"
        onClick={() => openAttributesDialog(rowData)}
      />
    );
  };

  // --- Templates de la tabla ---
  const priceBodyTemplate = (rowData: IProduct) => {
    return rowData.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  const descriptionBodyTemplate = (rowData: IProduct) => {
    return <ExpandableDescription text={rowData.description} />;
  };

  // --- NUEVO: Funciones para el Dialog de *Crear* Producto ---

  // Botón "Nuevo Producto" en la barra de herramientas
  const toolbarLeftTemplate = () => (
    <Button
      label="Nuevo Producto"
      icon="pi pi-plus"
      severity="success"
      onClick={() => setIsCreateDialogVisible(true)}
    />
  );

  // Se llama cuando el formulario guarda exitosamente
  const handleProductSave = (newProduct: IProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]); // Añade el nuevo producto a la tabla
    setIsCreateDialogVisible(false); // Cierra el dialog
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Producto creado correctamente",
      life: 3000,
    });
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
    <div>
      <Toast ref={toast} /> {/* <-- NUEVO: Para notificaciones */}
      <div className="card m-4 shadow-lg border rounded-lg overflow-hidden">
        {/* --- NUEVO: Barra de herramientas con el botón --- */}
        <Toolbar
          className="mb-4 rounded-t-lg"
          start={toolbarLeftTemplate}
        ></Toolbar>

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
            header="Caracteristicas Adicionales"
            body={attributesBodyTemplate}
            className="min-w-[6rem] text-center"
          />
        </DataTable>
      </div>
      {/* --- Dialog de VER Atributos (Sin cambios) --- */}
      <Dialog
        visible={isAttributesDialogVisible}
        onHide={hideAttributesDialog}
        header={`Atributos de: ${selectedProduct?.name || ""}`}
        modal
        style={{ width: "30rem" }}
        className="p-4"
      >
        {selectedProduct && selectedProduct.attributes ? (
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
      {/* --- NUEVO: El componente de Dialog para CREAR --- */}
      <ProductFormDialog
        visible={isCreateDialogVisible}
        onHide={() => setIsCreateDialogVisible(false)}
        onSave={handleProductSave}
      />
    </div>
  );
};

export default ProductListPage;
