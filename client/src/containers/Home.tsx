import React from "react";

export const Home: React.FC = () => {
  return (
    <>
      {/* Hero */}
      <div
        className="relative -mt-5 h-100 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://mdbootstrap.com/img/Photos/Others/img%20(51).jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            DJR-ECOMMERCE
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Categories */}
        <section>
          <h4 className="my-10 text-center text-xl font-semibold">
            Categories
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Dresses", img: "img(1).jpg" },
              { title: "Shirts", img: "img(2).jpg" },
              { title: "Jeans", img: "img(3).jpg" },
              { title: "Shoes", img: "img(4).jpg" },
              { title: "Accessories", img: "img(5).jpg" },
              { title: "Jewelry", img: "img(6).jpg" },
            ].map((c, i) => (
              <div key={i} className="group relative overflow-hidden rounded">
                <img
                  src={`https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/${c.img}`}
                  alt={c.title}
                  className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <h5 className="text-white font-semibold">
                    {c.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        <section>
          <h4 className="my-10 text-center text-xl font-semibold">
            Bestsellers
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Black denim jacket",
                price: "$99.99",
                imgA: "15a.jpg",
                imgB: "15.jpg",
              },
              {
                title: "Red hoodie",
                price: "$35.99",
                imgA: "13a.jpg",
                imgB: "13.jpg",
              },
              {
                title: "Grey sweater",
                price: "$21.99",
                old: "$36.99",
                imgA: "14a.jpg",
                imgB: "14.jpg",
              },
            ].map((p, i) => (
              <div key={i} className="border rounded overflow-hidden">
                <div className="relative group">
                  <img
                    src={`https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/${p.imgA}`}
                    className="w-full"
                    alt={p.title}
                  />
                  <img
                    src={`https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/${p.imgB}`}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                    alt={p.title}
                  />
                </div>

                <div className="p-4 text-center">
                  <h5 className="font-semibold">{p.title}</h5>
                  <hr className="my-2" />
                  <p>
                    <strong className={p.old ? "text-red-600" : ""}>
                      {p.price}
                    </strong>{" "}
                    {p.old && (
                      <span className="text-gray-400 line-through">
                        {p.old}
                      </span>
                    )}
                  </p>

                  <div className="mt-3 flex justify-center gap-2">
                    <button className="rounded bg-gray-800 px-3 py-1 text-white text-sm">
                      Add to cart
                    </button>
                    <button className="rounded bg-red-600 px-3 py-1 text-white text-sm">
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New products */}
        <section>
          <h4 className="my-10 text-center text-xl font-semibold">
            New products
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Round mirror", price: "$55.00", img: "58.jpg" },
              { title: "Small wicker basket", price: "$9.00", img: "59.jpg" },
              { title: "Ceramic hare", price: "$29.00", img: "60.jpg" },
            ].map((p, i) => (
              <div key={i} className="text-center">
                <img
                  src={`https://mdbootstrap.com/img/Photos/Horizontal/Interior/img(${p.img}`}
                  className="rounded shadow"
                  alt={p.title}
                />
                <h5 className="mt-4 font-semibold">{p.title}</h5>
                <p className="mb-3">{p.price}</p>

                <div className="flex justify-center gap-2">
                  <button className="rounded bg-gray-800 px-3 py-1 text-white text-sm">
                    Add to cart
                  </button>
                  <button className="rounded bg-red-600 px-3 py-1 text-white text-sm">
                    ♥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="my-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                name: "Maria Dolores",
                role: "Web Designer",
                img: "img%20(1).jpg",
              },
              {
                name: "Carmen Martinez",
                role: "Frontend Developer",
                img: "img%20(2).jpg",
              },
              {
                name: "Hugo Romero",
                role: "Digital Marketing Analyst",
                img: "img%20(3).jpg",
              },
            ].map((t, i) => (
              <div key={i}>
                <img
                  src={`https://mdbootstrap.com/img/Photos/Avatars/${t.img}`}
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                  alt={t.name}
                />
                <h5 className="mt-4 font-semibold">{t.name}</h5>
                <p className="text-sm text-gray-500">{t.role}</p>
                <p className="mt-2 text-sm text-gray-600">
                  “Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit.”
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
