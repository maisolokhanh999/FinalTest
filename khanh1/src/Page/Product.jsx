const Product = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold">Product 1</h3>
          <p>$19.99</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold">Product 2</h3>
          <p>$29.99</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold">Product 3</h3>
          <p>$39.99</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
