import React, { useState } from 'react';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('starters');

  const menuData: Record<string, MenuCategory> = {
    starters: {
      title: "Starters",
      items: [
        {
          name: "Truffle Arancini",
          description: "Crispy risotto balls stuffed with mozzarella, served with roasted tomato sauce",
          price: "$14",
          vegetarian: true,
          popular: true
        },
        {
          name: "Seared Scallops",
          description: "Pan-seared scallops with cauliflower purée and pancetta crisps",
          price: "$18"
        },
        {
          name: "Spiced Lamb Sliders",
          description: "Mini lamb patties with mint yogurt and pickled onions on brioche buns",
          price: "$16",
          spicy: true
        },
        {
          name: "Burrata & Fig Salad",
          description: "Fresh burrata with roasted figs, arugula, and balsamic reduction",
          price: "$15",
          vegetarian: true
        },
        {
          name: "Crispy Calamari",
          description: "Flash-fried squid rings with spicy marinara and lemon aioli",
          price: "$13",
          spicy: true
        }
      ]
    },
    mains: {
      title: "Main Courses",
      items: [
        {
          name: "Herb-Crusted Salmon",
          description: "Atlantic salmon with herb crust, roasted vegetables, and lemon butter sauce",
          price: "$28",
          popular: true
        },
        {
          name: "Braised Short Ribs",
          description: "Slow-braised beef short ribs with garlic mashed potatoes and red wine jus",
          price: "$32"
        },
        {
          name: "Truffle Mushroom Risotto",
          description: "Creamy arborio rice with wild mushrooms, truffle oil, and parmesan",
          price: "$24",
          vegetarian: true,
          popular: true
        },
        {
          name: "Duck Confit",
          description: "Slow-cooked duck leg with cherry gastrique and roasted root vegetables",
          price: "$30"
        },
        {
          name: "Spicy Thai Curry",
          description: "Coconut curry with your choice of chicken or tofu, jasmine rice",
          price: "$22",
          spicy: true
        },
        {
          name: "Grilled Lamb Chops",
          description: "Herb-marinated lamb chops with ratatouille and rosemary jus",
          price: "$34"
        }
      ]
    },
    desserts: {
      title: "Desserts",
      items: [
        {
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with molten center, vanilla ice cream, and berry coulis",
          price: "$12",
          popular: true
        },
        {
          name: "Tiramisu",
          description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
          price: "$10"
        },
        {
          name: "Lemon Tart",
          description: "Tangy lemon curd in buttery pastry shell with whipped cream",
          price: "$9",
          vegetarian: true
        },
        {
          name: "Crème Brûlée",
          description: "Vanilla custard with caramelized sugar crust and fresh berries",
          price: "$11",
          vegetarian: true
        },
        {
          name: "Seasonal Fruit Tart",
          description: "Fresh seasonal fruits on vanilla pastry cream with mint",
          price: "$10",
          vegetarian: true
        }
      ]
    },
    drinks: {
      title: "Beverages",
      items: [
        {
          name: "House Wine Selection",
          description: "Carefully curated red, white, and rosé wines by the glass",
          price: "$8-14"
        },
        {
          name: "Craft Cocktails",
          description: "Handcrafted cocktails featuring premium spirits and fresh ingredients",
          price: "$12-16"
        },
        {
          name: "Artisan Coffee",
          description: "Single-origin coffee beans, espresso drinks, and specialty lattes",
          price: "$4-6"
        },
        {
          name: "Fresh Juices",
          description: "Daily pressed orange, apple, and seasonal fruit juices",
          price: "$5-7",
          vegetarian: true
        },
        {
          name: "Herbal Teas",
          description: "Premium loose-leaf teas including chamomile, peppermint, and Earl Grey",
          price: "$4",
          vegetarian: true
        }
      ]
    }
  };

  const categories = [
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Main Courses' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Beverages' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-warm-brown-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-6">
            Our Menu
          </h1>
          <p className="font-body text-xl text-cream-200 max-w-3xl mx-auto">
            Discover our carefully crafted dishes that blend authentic flavors with creative innovation, 
            using only the freshest seasonal ingredients.
          </p>
        </div>
      </section>

      {/* Menu Navigation */}
      <section className="sticky top-16 md:top-20 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap font-body font-medium pb-2 border-b-2 transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'text-sage-green-600 border-sage-green-600'
                    : 'text-warm-brown-600 border-transparent hover:text-sage-green-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-8 text-center">
              {menuData[activeCategory].title}
            </h2>

            <div className="space-y-8">
              {menuData[activeCategory].items.map((item, index) => (
                <div key={index} className="border-b border-cream-200 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-body text-xl font-semibold text-warm-brown-700">
                        {item.name}
                      </h3>
                      <div className="flex space-x-2">
                        {item.popular && (
                          <span className="bg-sage-green-100 text-sage-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Popular
                          </span>
                        )}
                        {item.spicy && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Spicy
                          </span>
                        )}
                        {item.vegetarian && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Vegetarian
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-body text-lg font-semibold text-sage-green-600 ml-4">
                      {item.price}
                    </span>
                  </div>
                  <p className="font-body text-warm-brown-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-12 text-center">
            Taste the Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Grilled Salmon"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-body font-semibold">Fresh Seafood</h3>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Pasta Dish"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-body font-semibold">Artisan Pasta</h3>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Desserts"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-body font-semibold">Decadent Desserts</h3>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src="https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Cocktails"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-body font-semibold">Craft Cocktails</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sage-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Taste These Flavors?
          </h2>
          <p className="font-body text-xl text-sage-green-100 mb-8">
            Reserve your table today and experience our chef's carefully crafted dishes 
            in our warm, welcoming atmosphere.
          </p>
          <a
            href="/contact"
            className="bg-white text-sage-green-600 px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-cream-100 transition-colors duration-200"
          >
            Make a Reservation
          </a>
        </div>
      </section>
    </div>
  );
};

export default Menu;