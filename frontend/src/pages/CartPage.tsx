import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import apiClient from "../services/api";
// 1. Importamos también ICartItem para quitar el 'any'
import type { ICart, ICartItem } from "../types/interfaces";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  // Cargar carrito al entrar
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get<ICart>("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Item
  const removeItem = async (productId: string) => {
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      setCart(response.data);
      toast.current?.show({
        severity: "info",
        summary: "Eliminado",
        detail: "Producto eliminado del carrito",
      });
    } catch (error) {
      // 2. Corregido: Usamos 'error' (con console.error) para que no sea una variable sin usar
      console.error("Error removing item:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar",
      });
    }
  };

  // Formato de moneda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Template para botón de borrar
  // 3. Corregido: En lugar de 'any', usamos 'ICartItem'
  const actionTemplate = (rowData: ICartItem) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => removeItem(rowData.productId)}
      />
    );
  };

  // (Eliminé 'footerGroup' porque lo definías pero no lo estabas usando en el render)

  if (loading) return <div className="p-4">Cargando carrito...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <i className="pi pi-shopping-cart text-6xl text-gray-300"></i>
        <h2 className="text-2xl text-gray-600">Tu carrito está vacío</h2>
        <Button label="Ir a comprar" onClick={() => navigate("/products")} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABLA DE ITEMS (Ocupa 2 columnas) */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-round-xl">
            <DataTable value={cart.items} className="p-datatable-sm">
              <Column field="productName" header="Producto" />
              <Column
                field="price"
                header="Precio"
                body={(row: ICartItem) => formatCurrency(row.price)}
              />
              <Column field="quantity" header="Cant." />
              <Column
                field="subtotal"
                header="Subtotal"
                body={(row: ICartItem) => formatCurrency(row.subtotal)}
                style={{ fontWeight: "bold" }}
              />
              <Column body={actionTemplate} style={{ width: "4rem" }} />
            </DataTable>
          </Card>
        </div>

        {/* RESUMEN DE PAGO (Ocupa 1 columna) */}
        <div className="lg:col-span-1">
          <Card
            title="Resumen del Pedido"
            className="shadow-lg border-round-xl sticky top-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>

              <Button
                label="Proceder al Pago"
                icon="pi pi-check"
                size="large"
                className="w-full mt-4 font-bold"
                severity="success"
                onClick={() =>
                  toast.current?.show({
                    severity: "success",
                    summary: "Compra simulada",
                    detail: "¡Gracias por comprar!",
                  })
                }
              />

              <div className="flex justify-center gap-2 mt-2">
                <Tag value="Envío Seguro" severity="info" icon="pi pi-lock" />
                <Tag
                  value="Garantía"
                  severity="success"
                  icon="pi pi-verified"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
