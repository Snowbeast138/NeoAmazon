import React, { useState, useRef, useEffect } from "react";
import apiClient from "../services/api";
import type { IProduct } from "../types/interfaces";

// --- Importaciones de PrimeReact ---
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import type { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

// --- Definición de tipos ---
interface ProductFormDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (product: IProduct) => void;
}

interface AttributeRow {
  id: number; // Para el 'key' de React
  key: string;
  value: string;
}

const emptyProduct: Omit<IProduct, "_id" | "createdAt"> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  attributes: {},
};

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  visible,
  onHide,
  onSave,
}) => {
  const [productData, setProductData] = useState(emptyProduct);
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useRef<Toast>(null);

  // --- Resetear el formulario cada vez que se abre ---
  useEffect(() => {
    if (visible) {
      setProductData(emptyProduct);
      setAttributes([]);
      setIsSaving(false);
    }
  }, [visible]);

  // --- Handlers del Formulario Principal ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    setProductData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    setProductData((prev) => ({ ...prev, [name]: e.value ?? 0 }));
  };

  // --- Handlers de Atributos Dinámicos ---
  const addAttribute = () => {
    setAttributes((prev) => [...prev, { id: Date.now(), key: "", value: "" }]);
  };

  const removeAttribute = (id: number) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  const handleAttributeChange = (
    id: number,
    field: "key" | "value",
    value: string
  ) => {
    setAttributes((prev) =>
      prev.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr))
    );
  };

  // --- Guardar Producto ---
  const handleSave = async () => {
    setIsSaving(true);

    // 1. Convertir el array de atributos a un objeto
    const attributesObject = attributes.reduce((acc, attr) => {
      if (attr.key.trim()) {
        // Solo añade si la clave no está vacía
        acc[attr.key.trim()] = attr.value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    // 2. Crear el payload final
    const payload = {
      ...productData,
      attributes: attributesObject,
    };

    try {
      // 3. Enviar a la API (como JSON)
      const response = await apiClient.post<IProduct>("/products", payload);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto guardado.",
        life: 2000,
      });
      onSave(response.data); // Pasa el nuevo producto al padre
    } catch (err) {
      console.error("Error guardando producto:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el producto.",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Pie de página del Dialog ---
  const dialogFooter = (
    <div className="pt-4">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={onHide}
        className="p-button-text"
        disabled={isSaving}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSave}
        loading={isSaving}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Crear Nuevo Producto"
      modal
      className="p-fluid"
      footer={dialogFooter}
    >
      <Toast ref={toast} />

      {/* --- Campos Principales --- */}
      <div className="field">
        <label htmlFor="name" className="font-bold">
          Nombre
        </label>
        <InputText
          id="name"
          value={productData.name}
          onChange={(e) => handleInputChange(e, "name")}
          required
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="description" className="font-bold">
          Descripción
        </label>
        <InputTextarea
          id="description"
          value={productData.description}
          onChange={(e) => handleInputChange(e, "description")}
          required
          rows={3}
        />
      </div>

      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="price" className="font-bold">
            Precio
          </label>
          <InputNumber
            id="price"
            value={productData.price}
            onValueChange={(e) => handleNumberChange(e, "price")}
            mode="currency"
            currency="USD"
            locale="en-US"
            required
          />
        </div>
        <div className="field col">
          <label htmlFor="stock" className="font-bold">
            Stock
          </label>
          <InputNumber
            id="stock"
            value={productData.stock}
            onValueChange={(e) => handleNumberChange(e, "stock")}
            step={1}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="category" className="font-bold">
          Categoría
        </label>
        <InputText
          id="category"
          value={productData.category}
          onChange={(e) => handleInputChange(e, "category")}
          required
        />
      </div>

      {/* --- Sección de Atributos Dinámicos --- */}
      <div className="field">
        <label className="font-bold">Caracteristicas Adicionales</label>
        {attributes.map((attr) => (
          <div className="formgrid grid items-center gap-2 mb-2" key={attr.id}>
            <div className="col-4">
              <InputText
                placeholder="Clave: Talla"
                value={attr.key}
                onChange={(e) =>
                  handleAttributeChange(attr.id, "key", e.target.value)
                }
              />
            </div>
            <div className="col">
              <InputText
                placeholder="Valor: M"
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(attr.id, "value", e.target.value)
                }
              />
            </div>
            <div className="col-fixed" style={{ width: "3rem" }}>
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                onClick={() => removeAttribute(attr.id)}
              />
            </div>
          </div>
        ))}
        <Button
          label="Añadir Atributo"
          icon="pi pi-plus"
          severity="success"
          outlined
          onClick={addAttribute}
          className="mt-2 w-auto"
        />
      </div>
    </Dialog>
  );
};

export default ProductFormDialog;
