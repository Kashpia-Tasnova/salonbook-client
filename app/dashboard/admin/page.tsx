"use client";

import Link from "next/link";
import { useState } from "react";

type Tab = "Overview" | "Services" | "Appointments" | "Users" | "Transactions";

type Service = {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: string;
  active: boolean;
};

type AdminAppointment = {
  id: number;
  customer: string;
  email: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  payment: "Paid" | "Unpaid";
};

type Customer = {
  id: number;
  name: string;
  email: string;
  joined: string;
  blocked: boolean;
};

const initialServices: Service[] = [
  { id: 1, name: "HydraFacial Treatment", category: "Facial & Skincare", price: 3500, duration: "60 min", active: true },
  { id: 2, name: "Layer Haircut", category: "Haircut & Styling", price: 1200, duration: "45 min", active: true },
  { id: 3, name: "Keratin Treatment", category: "Hair Treatment", price: 5500, duration: "120 min", active: true },
  { id: 4, name: "Gel Manicure", category: "Manicure & Pedicure", price: 1800, duration: "50 min", active: true },
  { id: 5, name: "Bridal Makeup", category: "Bridal Beauty", price: 8500, duration: "150 min", active: false },
];

const initialAppointments: AdminAppointment[] = [
  { id: 1001, customer: "Sarah Ahmed", email: "sarah@example.com", service: "HydraFacial Treatment", date: "25 Nov 2026", time: "11:00 AM", price: 3500, status: "Confirmed", payment: "Unpaid" },
  { id: 1002, customer: "Nusrat Jahan", email: "nusrat@example.com", service: "Layer Haircut", date: "26 Nov 2026", time: "02:00 PM", price: 1200, status: "Pending", payment: "Unpaid" },
  { id: 1003, customer: "Maliha Rahman", email: "maliha@example.com", service: "Gel Manicure", date: "27 Nov 2026", time: "04:00 PM", price: 1800, status: "Completed", payment: "Paid" },
  { id: 1004, customer: "Ayesha Khan", email: "ayesha@example.com", service: "Keratin Treatment", date: "28 Nov 2026", time: "12:00 PM", price: 5500, status: "Pending", payment: "Unpaid" },
];

const initialCustomers: Customer[] = [
  { id: 1, name: "Sarah Ahmed", email: "sarah@example.com", joined: "10 Nov 2026", blocked: false },
  { id: 2, name: "Nusrat Jahan", email: "nusrat@example.com", joined: "12 Nov 2026", blocked: false },
  { id: 3, name: "Maliha Rahman", email: "maliha@example.com", joined: "15 Nov 2026", blocked: false },
  { id: 4, name: "Ayesha Khan", email: "ayesha@example.com", joined: "17 Nov 2026", blocked: true },
];

const navigation: { name: Tab; icon: string }[] = [
  { name: "Overview", icon: "◫" },
  { name: "Services", icon: "✿" },
  { name: "Appointments", icon: "▦" },
  { name: "Users", icon: "♙" },
  { name: "Transactions", icon: "৳" },
];

const money = (amount: number) =>
  `৳${amount.toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [services, setServices] = useState(initialServices);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [customers, setCustomers] = useState(initialCustomers);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Facial & Skincare");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const paidRevenue = appointments
    .filter((a) => a.payment === "Paid")
    .reduce((total, a) => total + a.price, 0);

  const stats = [
    { title: "Total Services", value: services.length, icon: "✿", note: "Salon services" },
    { title: "Total Appointments", value: appointments.length, icon: "▦", note: "All bookings" },
    { title: "Total Customers", value: customers.length, icon: "♙", note: "Registered users" },
    { title: "Paid Revenue", value: money(paidRevenue), icon: "৳", note: "Verified payments" },
  ];

  const statusStyle = (status: string) => {
    if (status === "Confirmed" || status === "Paid" || status === "Active") {
      return "bg-green-50 text-green-700";
    }
    if (status === "Pending" || status === "Unpaid") {
      return "bg-amber-50 text-amber-700";
    }
    if (status === "Cancelled" || status === "Blocked") {
      return "bg-red-50 text-red-700";
    }
    return "bg-blue-50 text-blue-700";
  };

  const resetServiceForm = () => {
    setServiceName("");
    setServiceCategory("Facial & Skincare");
    setServicePrice("");
    setServiceDuration("");
    setEditingService(null);
    setShowServiceForm(false);
  };

  const handleServiceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!serviceName.trim() || Number(servicePrice) <= 0 || Number(serviceDuration) <= 0) {
      return;
    }

    if (editingService) {
      setServices((previous) =>
        previous.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                name: serviceName.trim(),
                category: serviceCategory,
                price: Number(servicePrice),
                duration: `${serviceDuration} min`,
              }
            : service
        )
      );
    } else {
      setServices((previous) => [
        ...previous,
        {
          id: Date.now(),
          name: serviceName.trim(),
          category: serviceCategory,
          price: Number(servicePrice),
          duration: `${serviceDuration} min`,
          active: true,
        },
      ]);
    }

    resetServiceForm();
  };

  const startEditing = (service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceCategory(service.category);
    setServicePrice(String(service.price));
    setServiceDuration(service.duration.replace(" min", ""));
    setShowServiceForm(true);
  };

  const deleteService = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setServices((previous) => previous.filter((service) => service.id !== id));
  };

  const toggleService = (id: number) => {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  const updateAppointment = (id: number, status: AdminAppointment["status"]) => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const toggleCustomerBlock = (id: number) => {
    setCustomers((previous) =>
      previous.map((customer) =>
        customer.id === id ? { ...customer, blocked: !customer.blocked } : customer
      )
    );
  };

  const renderOverview = () => (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="border border-[#E6E1DD] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">{stat.title}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5ECE8] text-xl text-[#967467]">
                {stat.icon}
              </span>
            </div>
            <p className="font-serif text-3xl text-[#46322D]">{stat.value}</p>
            <p className="mt-1 text-xs text-[#A39A94]">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border border-[#E6E1DD] bg-white p-6">
          <h3 className="font-serif text-xl text-[#46322D]">Appointment Overview</h3>
          <p className="mt-1 text-sm text-[#7A7470]">Current booking statuses</p>

          <div className="mt-6 space-y-5">
            {[
              { label: "Pending", count: pendingCount, color: "bg-amber-400" },
              { label: "Confirmed", count: confirmedCount, color: "bg-green-500" },
              { label: "Completed", count: completedCount, color: "bg-blue-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#7A7470]">{item.label}</span>
                  <span className="font-medium text-[#46322D]">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden bg-[#F5ECE8]">
                  <div
                    className={`h-full ${item.color}`}
                    style={{
                      width: `${appointments.length ? (item.count / appointments.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#E6E1DD] bg-white p-6">
          <h3 className="font-serif text-xl text-[#46322D]">Salon at a Glance</h3>
          <p className="mt-1 text-sm text-[#7A7470]">A quick look at your business</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-[#FDFCFC] p-4">
              <p className="text-xs text-[#7A7470]">Active Services</p>
              <p className="mt-2 font-serif text-2xl text-[#46322D]">
                {services.filter((s) => s.active).length}
              </p>
            </div>
            <div className="bg-[#FDFCFC] p-4">
              <p className="text-xs text-[#7A7470]">Blocked Users</p>
              <p className="mt-2 font-serif text-2xl text-[#46322D]">
                {customers.filter((c) => c.blocked).length}
              </p>
            </div>
            <div className="bg-[#FDFCFC] p-4">
              <p className="text-xs text-[#7A7470]">Paid Revenue</p>
              <p className="mt-2 font-serif text-2xl text-[#46322D]">{money(paidRevenue)}</p>
            </div>
            <div className="bg-[#FDFCFC] p-4">
              <p className="text-xs text-[#7A7470]">Total Customers</p>
              <p className="mt-2 font-serif text-2xl text-[#46322D]">{customers.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 border border-[#E6E1DD] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6E1DD] p-5 sm:px-6">
          <div>
            <h3 className="font-serif text-xl text-[#46322D]">Recent Appointments</h3>
            <p className="mt-1 text-sm text-[#7A7470]">Latest customer bookings</p>
          </div>
          <button
            onClick={() => setActiveTab("Appointments")}
            className="text-sm font-medium text-[#967467] hover:text-[#B39A7D]"
          >
            View All →
          </button>
        </div>

        <div className="divide-y divide-[#E6E1DD]">
          {appointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6">
              <div>
                <p className="font-medium text-[#46322D]">{appointment.customer}</p>
                <p className="mt-1 text-sm text-[#7A7470]">{appointment.service}</p>
                <p className="mt-1 text-xs text-[#A39A94]">{appointment.date} · {appointment.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs ${statusStyle(appointment.status)}`}>
                  {appointment.status}
                </span>
                <span className="text-sm font-medium text-[#46322D]">{money(appointment.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderServices = () => (
    <section className="border border-[#E6E1DD] bg-white">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E6E1DD] p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="font-serif text-2xl text-[#46322D]">Manage Services</h2>
          <p className="mt-1 text-sm text-[#7A7470]">Add and manage your salon offerings.</p>
        </div>
        <button
          onClick={() => {
            resetServiceForm();
            setShowServiceForm(true);
          }}
          className="bg-[#B39A7D] px-5 py-3 text-sm font-medium text-white hover:bg-[#967467]"
        >
          + Add New Service
        </button>
      </div>

      {showServiceForm && (
        <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 gap-4 border-b border-[#E6E1DD] bg-[#FDFCFC] p-5 sm:grid-cols-2 sm:p-6">
          <h3 className="font-serif text-xl text-[#46322D] sm:col-span-2">
            {editingService ? "Edit Service" : "Add New Service"}
          </h3>

          <label className="text-sm text-[#46322D]">
            Service Name
            <input
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. HydraFacial Treatment"
              className="mt-2 w-full border border-[#E6E1DD] bg-white px-4 py-3 outline-none focus:border-[#B39A7D]"
            />
          </label>

          <label className="text-sm text-[#46322D]">
            Category
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="mt-2 w-full border border-[#E6E1DD] bg-white px-4 py-3 outline-none focus:border-[#B39A7D]"
            >
              {[
                "Haircut & Styling",
                "Hair Coloring",
                "Facial & Skincare",
                "Manicure & Pedicure",
                "Hair Treatment",
                "Makeup",
                "Body Spa",
                "Bridal Beauty",
              ].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-[#46322D]">
            Price (BDT)
            <input
              required
              min="1"
              type="number"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              placeholder="3500"
              className="mt-2 w-full border border-[#E6E1DD] bg-white px-4 py-3 outline-none focus:border-[#B39A7D]"
            />
          </label>

          <label className="text-sm text-[#46322D]">
            Duration (minutes)
            <input
              required
              min="1"
              type="number"
              value={serviceDuration}
              onChange={(e) => setServiceDuration(e.target.value)}
              placeholder="60"
              className="mt-2 w-full border border-[#E6E1DD] bg-white px-4 py-3 outline-none focus:border-[#B39A7D]"
            />
          </label>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className="bg-[#B39A7D] px-5 py-3 text-sm text-white hover:bg-[#967467]">
              {editingService ? "Save Changes" : "Add Service"}
            </button>
            <button type="button" onClick={resetServiceForm} className="border border-[#E6E1DD] px-5 py-3 text-sm text-[#7A7470] hover:bg-white">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-[#E6E1DD]">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h3 className="font-medium text-[#46322D]">{service.name}</h3>
              <p className="mt-1 text-sm text-[#7A7470]">{service.category} · {service.duration}</p>
              <p className="mt-1 text-sm font-medium text-[#967467]">{money(service.price)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 text-xs ${statusStyle(service.active ? "Active" : "Blocked")}`}>
                {service.active ? "Active" : "Inactive"}
              </span>
              <button onClick={() => toggleService(service.id)} className="border border-[#E6E1DD] px-3 py-2 text-xs text-[#7A7470] hover:bg-[#FDFCFC]">
                {service.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => startEditing(service)} className="border border-[#E6E1DD] px-3 py-2 text-xs text-[#967467] hover:bg-[#F5ECE8]">
                Edit
              </button>
              <button onClick={() => deleteService(service.id)} className="border border-red-100 px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderAppointments = () => (
    <section className="border border-[#E6E1DD] bg-white">
      <div className="border-b border-[#E6E1DD] p-5 sm:px-6">
        <h2 className="font-serif text-2xl text-[#46322D]">Manage Appointments</h2>
        <p className="mt-1 text-sm text-[#7A7470]">Review and update customer bookings.</p>
      </div>

      <div className="divide-y divide-[#E6E1DD]">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <p className="font-medium text-[#46322D]">{appointment.customer}</p>
              <p className="text-xs text-[#A39A94]">{appointment.email}</p>
              <p className="mt-2 text-sm text-[#7A7470]">{appointment.service}</p>
              <p className="mt-1 text-xs text-[#7A7470]">{appointment.date} · {appointment.time}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="text-xs text-[#A39A94]">Price</p>
                <p className="mt-1 text-sm font-medium text-[#46322D]">{money(appointment.price)}</p>
              </div>
              <div>
                <p className="text-xs text-[#A39A94]">Payment</p>
                <span className={`mt-1 inline-block px-3 py-1 text-xs ${statusStyle(appointment.payment)}`}>
                  {appointment.payment}
                </span>
              </div>
              <span className={`px-3 py-1 text-xs ${statusStyle(appointment.status)}`}>
                {appointment.status}
              </span>

              {appointment.status === "Pending" && (
                <button onClick={() => updateAppointment(appointment.id, "Confirmed")} className="bg-[#B39A7D] px-3 py-2 text-xs text-white hover:bg-[#967467]">
                  Confirm
                </button>
              )}

              {(appointment.status === "Pending" || appointment.status === "Confirmed") && (
                <button onClick={() => updateAppointment(appointment.id, "Cancelled")} className="border border-red-100 px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderUsers = () => (
    <section className="border border-[#E6E1DD] bg-white">
      <div className="border-b border-[#E6E1DD] p-5 sm:px-6">
        <h2 className="font-serif text-2xl text-[#46322D]">Manage Users</h2>
        <p className="mt-1 text-sm text-[#7A7470]">View customer accounts and manage access.</p>
      </div>

      <div className="divide-y divide-[#E6E1DD]">
        {customers.map((customer) => (
          <div key={customer.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <p className="font-medium text-[#46322D]">{customer.name}</p>
              <p className="mt-1 text-sm text-[#7A7470]">{customer.email}</p>
              <p className="mt-1 text-xs text-[#A39A94]">Joined {customer.joined}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs ${statusStyle(customer.blocked ? "Blocked" : "Active")}`}>
                {customer.blocked ? "Blocked" : "Active"}
              </span>
              <button
                onClick={() => toggleCustomerBlock(customer.id)}
                className={`border px-4 py-2 text-xs ${
                  customer.blocked
                    ? "border-green-200 text-green-700 hover:bg-green-50"
                    : "border-red-100 text-red-600 hover:bg-red-50"
                }`}
              >
                {customer.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderTransactions = () => {
    const paidAppointments = appointments.filter((a) => a.payment === "Paid");

    return (
      <section className="border border-[#E6E1DD] bg-white">
        <div className="border-b border-[#E6E1DD] p-5 sm:px-6">
          <h2 className="font-serif text-2xl text-[#46322D]">Transactions</h2>
          <p className="mt-1 text-sm text-[#7A7470]">View recorded customer payments.</p>
        </div>

        {paidAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl text-[#46322D]">No transactions yet</p>
            <p className="mt-2 text-sm text-[#7A7470]">Verified payments will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6E1DD]">
            {paidAppointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6">
                <div>
                  <p className="font-medium text-[#46322D]">{appointment.customer}</p>
                  <p className="mt-1 text-sm text-[#7A7470]">{appointment.service}</p>
                  <p className="mt-1 text-xs text-[#A39A94]">Appointment #{appointment.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#46322D]">{money(appointment.price)}</p>
                  <span className="mt-1 inline-block bg-green-50 px-3 py-1 text-xs text-green-700">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#FDFCFC]">
      <header className="border-b border-[#E6E1DD] bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl text-[#B39A7D]">✿</span>
            <span className="font-serif text-xl font-semibold text-[#46322D]">Blush & Bloom</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-[#7A7470] hover:text-[#B39A7D] sm:block">
              Visit Website
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5ECE8] font-serif text-lg text-[#967467]">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#46322D]">Administrator</p>
              <p className="text-xs text-[#7A7470]">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">Administration</p>
          <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-[#7A7470]">Manage your salon and keep everything running beautifully.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit border border-[#E6E1DD] bg-white p-4">
            <p className="mb-3 px-3 text-xs uppercase tracking-[0.15em] text-[#A39A94]">Dashboard Menu</p>
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 text-left text-sm transition ${
                    activeTab === item.name
                      ? "bg-[#F5ECE8] font-medium text-[#967467]"
                      : "text-[#7A7470] hover:bg-[#FDFCFC] hover:text-[#46322D]"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl text-[#46322D]">{activeTab}</h2>
              <span className="text-xs text-[#A39A94]">Blush & Bloom · Admin Panel</span>
            </div>

            {activeTab === "Overview" && renderOverview()}
            {activeTab === "Services" && renderServices()}
            {activeTab === "Appointments" && renderAppointments()}
            {activeTab === "Users" && renderUsers()}
            {activeTab === "Transactions" && renderTransactions()}
          </div>
        </div>
      </div>
    </main>
  );
}