"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);

    const url = category
      ? `/api/products?category=${category}`
      : `/api/products`;

    const response = await fetch(`http://localhost:4000${url}`);

    const data = await response.json();

    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <span>Test</span>
    </div>
  );
}
