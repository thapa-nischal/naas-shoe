/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { editProduct } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SubmitButton } from "../SubmitButtons";
import { categories } from "@/lib/categories";
import { useState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { productSchema } from "@/lib/zodSchema";
import { useForm } from "@conform-to/react";
import { type $Enums } from "@prisma/client";

interface iAppProps {
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    status: $Enums.ProductStatus;
    images: string[];
    category: $Enums.Category;
    isFeatured: boolean;
  };
}

export function EditForm({ data }: iAppProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [lastResult, action] = useFormState(editProduct, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // Delete Image Function
  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="productId" value={data.id} />
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={"/dashboard/products"}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Edit your product details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Product Name */}
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                key={fields.name.key}
                name={fields.name.name}
                defaultValue={data.name}
                placeholder="Product Name"
                className="w-full"
              />
              <p className="text-xs text-red-500">{fields.name.errors}</p>
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                defaultValue={data.description}
                placeholder="Product Description"
                className="w-full"
              />
              <p className="text-xs text-red-500">
                {fields.description.errors}
              </p>
            </div>

            {/* Product Price */}
            <div className="flex flex-col gap-3">
              <Label>Price</Label>
              <Input
                typeof="number"
                key={fields.price.key}
                name={fields.price.name}
                defaultValue={data.price}
                placeholder="$ Price"
                className="w-full"
              />
              <p className="text-xs text-red-500">{fields.price.errors}</p>
            </div>

            {/* Featured Product */}
            <div className="flex flex-col gap-3">
              <Label>Featured Product</Label>
              <Switch
                key={fields.isFeatured.key}
                name={fields.isFeatured.name}
                defaultChecked={data.isFeatured}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select
                key={fields.status.key}
                name={fields.status.name}
                defaultValue={data.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-red-500">{fields.status.errors}</p>
            </div>

            {/* Product Category */}
            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                key={fields.category.key}
                name={fields.category.name}
                defaultValue={data.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-red-500">{fields.category.errors}</p>
            </div>

            {/* Product Images */}
            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input
                type="hidden"
                value={images}
                key={fields.images.key}
                name={fields.images.name}
                defaultValue={fields.images.initialValue as any}
              />
              {images.length > 0 ? (
                <div className="flex gap-5">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        height={100}
                        width={100}
                        src={image}
                        alt="image"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      {/* Delete Image Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onUploadError={() => {
                    alert("Error Uploading");
                  }}
                  onClientUploadComplete={(res) => {
                    setImages(res.map((r) => r.url));
                  }}
                />
              )}
              <p className="text-xs text-red-500">{fields.images.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update Product" />
        </CardFooter>
      </Card>
    </form>
  );
}
