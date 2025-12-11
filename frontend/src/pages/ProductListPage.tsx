import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // --- NUEVO: Para redirigir al login
import apiClient from "../services/api";
import type { IProduct } from "../types/interfaces";

// --- Importaciones de PrimeReact ---
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";

// --- Componentes Propios ---
import ProductFormDialog from "../components/ProductFormDialog";
import ExpandableDescription from "../components/ExpandableDescription";
import { useAuth } from "../context/AuthContext"; // --- NUEVO: Contexto de Auth

const ProductListPage: React.FC = () => {
  // --- Estados ---
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para Dialogs
  const [isAttributesDialogVisible, setIsAttributesDialogVisible] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isCreateDialogVisible, setIsCreateDialogVisible] =
    useState<boolean>(false);

  // Refs y Hooks
  const toast = useRef<Toast>(null);
  const { isAuthenticated } = useAuth(); // <-- Verificar si está logueado
  const navigate = useNavigate();

  // --- Carga Inicial ---
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

  // --- LÓGICA DEL CARRITO (NUEVO) ---
  const addToCart = async (product: IProduct) => {
    if (!isAuthenticated) {
      toast.current?.show({
        severity: "warn",
        summary: "Inicia Sesión",
        detail: "Debes estar logueado para comprar",
      });
      // Opcional: Redirigir al login
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      // Enviamos datos al backend (que los pasará a gRPC)
      await apiClient.post("/cart/add", {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });

      toast.current?.show({
        severity: "success",
        summary: "Agregado",
        detail: "Producto añadido al carrito",
        life: 2000,
      });
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo agregar al carrito",
      });
    }
  };

  // --- Templates de la Tabla ---

  // 1. Precio
  const priceBodyTemplate = (rowData: IProduct) => {
    return rowData.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // 2. Descripción Expandible
  const descriptionBodyTemplate = (rowData: IProduct) => {
    return <ExpandableDescription text={rowData.description} />;
  };

  // 3. Botón Ver Atributos
  const attributesBodyTemplate = (rowData: IProduct) => {
    const hasAttributes =
      rowData.attributes && Object.keys(rowData.attributes).length > 0;
    if (!hasAttributes) return <span className="text-gray-400">N/A</span>;
    return (
      <Button
        icon="pi pi-eye"
        outlined
        rounded
        text
        size="small"
        tooltip="Ver detalles"
        onClick={() => {
          setSelectedProduct(rowData);
          setIsAttributesDialogVisible(true);
        }}
      />
    );
  };

  // 4. Botón Agregar al Carrito (NUEVO)
  const actionBodyTemplate = (rowData: IProduct) => {
    return (
      <Button
        icon="pi pi-shopping-cart"
        rounded
        text
        severity="help" // Color morado/azul
        tooltip="Agregar al carrito"
        onClick={() => addToCart(rowData)}
      />
    );
  };

  // --- Lógica de Creación ---
  const toolbarLeftTemplate = () => (
    <Button
      label="Nuevo Producto"
      icon="pi pi-plus"
      severity="success"
      onClick={() => {
        if (!isAuthenticated) {
          toast.current?.show({
            severity: "warn",
            summary: "Atención",
            detail: "Inicia sesión para crear productos",
          });
          return;
        }
        setIsCreateDialogVisible(true);
      }}
    />
  );

  const handleProductSave = (newProduct: IProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setIsCreateDialogVisible(false);
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Producto creado correctamente",
    });
  };

  // --- Renderizado ---

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
      <Toast ref={toast} />

      <div className="card m-4 shadow-lg border rounded-lg overflow-hidden bg-white">
        <Toolbar
          className="mb-4 border-none bg-gray-50"
          start={toolbarLeftTemplate}
        />

        <DataTable
          value={products}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          dataKey="_id"
          header={
            <h1 className="text-2xl font-bold text-gray-800 m-0">
              Catálogo de Productos
            </h1>
          }
          emptyMessage="No se encontraron productos."
          className="p-datatable-gridlines"
          stripedRows
        >
          <Column
            field="name"
            header="Nombre"
            sortable
            className="min-w-[10rem] font-bold"
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
            className="text-green-600 font-bold"
          />

          <Column
            field="stock"
            header="Stock"
            sortable
            className="text-center"
          />

          <Column
            field="category"
            header="Categoría"
            sortable
            className="text-center"
          />

          {/* Columna de Atributos */}
          <Column
            header="Detalles"
            body={attributesBodyTemplate}
            className="text-center w-24"
          />

          {/* Columna de Acciones (Carrito) */}
          <Column
            header="Comprar"
            body={actionBodyTemplate}
            className="text-center w-24"
          />
        </DataTable>
      </div>

      {/* Dialog para Ver Atributos */}
      <Dialog
        visible={isAttributesDialogVisible}
        onHide={() => setIsAttributesDialogVisible(false)}
        header={`Detalles: ${selectedProduct?.name || ""}`}
        modal
        style={{ width: "30rem" }}
        className="p-4"
        dismissableMask
      >
        {selectedProduct && selectedProduct.attributes ? (
          <ul className="list-none p-0 m-0">
            {Object.entries(selectedProduct.attributes).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between border-b border-gray-100 py-2"
              >
                <span className="font-semibold text-gray-600 capitalize">
                  {key}:
                </span>
                <span className="text-gray-800">{String(value)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Sin atributos adicionales.</p>
        )}
      </Dialog>

      {/* Dialog para Crear Producto */}
      <ProductFormDialog
        visible={isCreateDialogVisible}
        onHide={() => setIsCreateDialogVisible(false)}
        onSave={handleProductSave}
      />
    </div>
  );
};

export default ProductListPage;
