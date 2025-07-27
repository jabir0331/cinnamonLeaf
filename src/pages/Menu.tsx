import React, { useState } from 'react';
import { Salad, ChefHat, IceCream, Coffee } from 'lucide-react';

// Import all menu images
import bruschettaTrio from '../assets/images/menu/starters/bruschettaTrio.jpg';
import stuffedMushrooms from '../assets/images/menu/starters/stuffedMushrooms.jpg';
import cheesySpinachDip from '../assets/images/menu/starters/cheesySpinachDip.jpg';
import chickenCaesarBites from '../assets/images/menu/starters/chickenCaesarBites.jpg';
import garlicPrawn from '../assets/images/menu/starters/garlicPrawn.jpg';

import grilledChickenAlfredo from '../assets/images/menu/mainCourses/grilledChickenAlfredo.jpg';
import hyderabadChickenBiriyani from '../assets/images/menu/mainCourses/hyderabadChickenBiriyani.jpg';
import beefLasagna from '../assets/images/menu/mainCourses/beefLasagna.jpg';
import beefMaqluba from '../assets/images/menu/mainCourses/beefMaqluba.jpg';
import muttonMandi from '../assets/images/menu/mainCourses/muttonMandi.jpg';

import brownies from '../assets/images/menu/desert/brownies.jpg';
import chocolateLavaCake from '../assets/images/menu/desert/chocolateLavaCake.jpg';
import tiramisu from '../assets/images/menu/desert/tiramisu.jpg';
import strawberryCheeseCake from '../assets/images/menu/desert/strawberryCheeseCake.jpg';
import appleCrumble from '../assets/images/menu/desert/appleCrumble.jpg';

import lemonIcedTea from '../assets/images/menu/beverages/lemonIcedTea.jpg';
import virginMojito from '../assets/images/menu/beverages/virginMojito.jpg';
import berrySparkler from '../assets/images/menu/beverages/berrySparkler.jpg';
import icedAmericano from '../assets/images/menu/beverages/icedAmericano.jpg';
import vanillaMilkshake from '../assets/images/menu/beverages/vanillaMilkshake.jpg';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: any; // Imported image module
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
          name: "Bruschetta Trio",
          description: "A vibrant trio of toasted baguette slices topped with fresh tomato-basil mix, creamy smashed avocado, and bold olive tapenade — each offering a unique burst of Mediterranean flavor and crunch",
          price: "LKR 850",
          image: bruschettaTrio,
          vegetarian: true
        },
        {
          name: "Stuffed Mushrooms",
          description: "Plump button mushrooms generously stuffed with a savory blend of herbed breadcrumbs, garlic, and melted cheese, baked until golden and bursting with earthy, cheesy goodness",
          price: "LKR 1050",
          image: stuffedMushrooms,
          vegetarian: true
        },
        {
          name: "Cheesy Spinach Dip",
          description: "A rich, velvety blend of spinach, cream cheese, mozzarella, and subtle spices, baked to perfection and served warm with crispy tortilla chips or toasted bread for the ultimate comfort dip",
          price: "LKR 1050",
          image: cheesySpinachDip,
          vegetarian: true
        },
        {
          name: "Chicken Caesar Bites",
          description: "Grilled chicken pieces nestled on crisp romaine lettuce cups, drizzled with creamy Caesar dressing, sprinkled with shaved parmesan, and finished with a crunchy crouton — a classic Caesar salad in every bite",
          price: "LKR 1250",
          image: chickenCaesarBites,
          popular: true
        },
        {
          name: "Garlic Butter Prawns",
          description: "Juicy prawns sautéed in a fragrant garlic butter sauce with hints of chili and lemon, served sizzling hot and garnished with herbs for a mouthwatering seafood delight",
          price: "LKR 1450",
          image: garlicPrawn,
          popular: true
        }
      ]
    },
    mains: {
      title: "Main Courses",
      items: [
        {
          name: "Grilled Chicken Alfredo",
          description: "Juicy grilled chicken served over fettuccine pasta, tossed in a rich, creamy Alfredo sauce made with butter, parmesan, and garlic a timeless Italian favorite.",
          price: "LKR 1850",
          image: grilledChickenAlfredo
        },
        {
          name: "Hyderabad Chicken Biriyani",
          description: "A royal blend of fragrant basmati rice and succulent chicken, slow-cooked with saffron and bold Hyderabadi spices bursting with rich, authentic flavors in every bite",
          price: "LKR 2250",
          image: hyderabadChickenBiriyani,
          popular: true
        },
        {
          name: "Beef Lasagna",
          description: "Layers of tender pasta, seasoned ground beef, rich tomato sauce, and creamy béchamel, all baked to golden perfection a hearty Italian classic loved by all.",
          price: "LKR 2450",
          image: beefLasagna
        },
        {
          name: "Beef Maqluba",
          description: "A flavorful upside-down rice dish layered with tender beef, spiced vegetables, and aromatic basmati rice a comforting Middle Eastern classic with a dramatic flip and rich taste.",
          price: "LKR 2850",
          image: beefMaqluba,
          popular: true
        },
        {
          name: "Mutton Mandi",
          description: "Tender, slow-cooked mutton served over fragrant basmati rice, infused with Arabic spices with a traditional Yemeni dish that melts in your mouth",
          price: "LKR 3250",
          image: muttonMandi,
          popular: true
        }
      ]
    },
    desserts: {
      title: "Desserts",
      items: [
        {
          name: "Chocolate Brownies",
          description: "Rich and fudgy chocolate brownies with a chewy center, crisp edges, and deep cocoa flavor a timeless indulgence that melts in your mouth with every bite",
          price: "LKR 250",
          image: brownies
        },
        {
          name: "Chocolate Lava Cake",
          description: "A decadent mini cake with a warm, gooey molten chocolate center that flows out as you cut in served best with a scoop of vanilla ice cream for the ultimate dessert experience",
          price: "LKR 750",
          image: chocolateLavaCake,
          popular: true
        },
        {
          name: "Tiramisu",
          description: "A luscious Italian classic made with layers of espresso soaked ladyfingers and mascarpone cream, dusted with rich cocoa light, dreamy, and just the right touch of coffee",
          price: "LKR 950",
          image: tiramisu
        },
        {
          name: "Strawberry Cheesecake",
          description: "A smooth and creamy cheesecake on a buttery biscuit base, topped with a vibrant strawberry glaze and fresh berries the perfect balance of sweet, tart, and creamy",
          price: "LKR 1050",
          image: strawberryCheeseCake,
          popular: true
        },
        {
          name: "Apple Crumble",
          description: "Warm spiced apples baked beneath a golden, buttery crumble topping served with a scoop of vanilla ice cream for a cozy and comforting treat",
          price: "LKR 1150",
          image: appleCrumble
        }
      ]
    },
    drinks: {
      title: "Beverages",
      items: [
        {
          name: "Lemon Iced Tea",
          description: "A cool and zesty blend of brewed black tea and fresh lemon juice, served over ice the perfect balance of citrusy tang and smooth tea flavor",
          price: "LKR 550",
          image: lemonIcedTea
        },
        {
          name: "Virgin Mojito",
          description: "A refreshing mix of muddled mint, lime, and soda water with a hint of sweetness crisp, cool, and alcohol-free, perfect for any time of day",
          price: "LKR 650",
          image: virginMojito
        },
        {
          name: "Berry Sparkler",
          description: "A bubbly, refreshing fusion of mixed berries and soda, lightly sweetened and served over ice fruity, fizzy, and full of vibrant flavor",
          price: "LKR 750",
          image: berrySparkler,
          popular: true
        },
        {
          name: "Iced Americano",
          description: "Bold espresso shots poured over chilled water and ice clean, robust, and a favorite for coffee lovers who like it strong and smooth",
          price: "LKR 850",
          image: icedAmericano
        },
        {
          name: "Vanilla Milkshake",
          description: "Thick and creamy blend of vanilla ice cream and milk, whipped smooth for a nostalgic treat that's rich, frosty, and satisfyingly sweet",
          price: "LKR 850",
          image: vanillaMilkshake
        }
      ]
    }
  };

  const categories = [
    { id: 'starters', label: 'Starters', icon: <Salad size={16} /> },
    { id: 'mains', label: 'Main Courses', icon: <ChefHat size={16} /> },
    { id: 'desserts', label: 'Desserts', icon: <IceCream size={16} /> },
    { id: 'drinks', label: 'Beverages', icon: <Coffee size={16} /> }
  ];

  return (
    <div>
      {/* Menu Navigation */}
      <section className="sticky top-15 md:top-20 z-40 bg-cream-50 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Our Menu
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Discover our carefully crafted dishes that blend authentic flavors with creative innovation,
            using only the freshest seasonal ingredients.
          </p>
          

          <div className="mb-6">
            <div className="flex gap-0.5 bg-warm-brown-100 rounded-xl p-1.5 mb-5 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
          flex-1 min-w-0 px-4 py-3 rounded-lg text-sm font-medium font-body
          transition-all duration-200 ease-in-out
          flex items-center justify-center gap-2
          whitespace-nowrap
          ${activeCategory === category.id
                      ? 'bg-white text-sage-green-600 shadow-sm'
                      : 'bg-transparent text-warm-brown-600 hover:bg-white/70 hover:text-sage-green-600'
                    }
        `}
                >
                  {/* Add icon if you have one */}
                  {category.icon && (
                    <span className="text-base block">
                      {category.icon}
                    </span>
                  )}
                  {category.label}
                </button>
              ))}
            </div>
          </div>




        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-10 text-center">
              {menuData[activeCategory].title}
            </h2>

            <div className="space-y-8">
              {menuData[activeCategory].items.map((item, index) => (
                <div key={index} className="border-b border-cream-200 pb-6 last:border-b-0">
                  <div className="flex gap-6">
                    {/* Food Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    {/* Food Details */}
                    <div className="flex-1 min-w-0">
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
                      <p className="font-body text-warm-brown-600 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Menu;