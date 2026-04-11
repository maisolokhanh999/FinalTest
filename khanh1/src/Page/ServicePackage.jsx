const ServicePackage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Service Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-6 rounded">
          <h3 className="font-bold text-xl mb-2">Basic Package</h3>
          <p>$49/mo</p>
          <ul className="mt-4">
            <li>• Basic support</li>
            <li>• 1 user</li>
          </ul>
        </div>
        <div className="border p-6 rounded">
          <h3 className="font-bold text-xl mb-2">Premium Package</h3>
          <p>$99/mo</p>
          <ul className="mt-4">
            <li>• Premium support</li>
            <li>• Unlimited users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicePackage;
