const products = [
    // Hot Warm Up
    { name: "Masala Tea", category: "Hot Beverages", price: 15, imageUrl: "https://content.instructables.com/ORIG/FW4/31PD/GUKARQY0/FW431PDGUKARQY0.jpg?auto=webp&frame=1&width=2100" },
    { name: "Hot Coffee", category: "Hot Beverages", price: 25, imageUrl: "https://tse3.mm.bing.net/th?id=OIP.scIn-JcNM84g7GUriOvsmgHaE7&pid=Api&P=0&h=220" },
    { name: "Black Tea", category: "Hot Beverages", price: 20, imageUrl: "https://tse3.mm.bing.net/th?id=OIP.FupsbPieHLRVatiFhWcCbgHaHa&pid=Api&P=0&h=220" },
    { name: "Green Tea", category: "Hot Beverages", price: 20, imageUrl: "https://tse1.mm.bing.net/th?id=OIP.cpPzy88fMBgjzq0o2QDm4QHaE9&pid=Api&P=0&h=220" },
    { name: "Lemon Tea", category: "Hot Beverages", price: 30, imageUrl: "https://www.archanaskitchen.com/images/archanaskitchen/beverages/Ginger_lemon_tea_recipe.jpg" },
    { name: "Espresso", category: "Hot Beverages", price: 50, imageUrl: "https://vuanem.com/blog/wp-content/uploads/2022/12/cach-pha-espresso-1.jpg" },
    { name: "Cappuccino", category: "Hot Beverages", price: 50, imageUrl: "https://methodicalcoffee.com/cdn/shop/articles/cap.jpg?v=1684507364&width=1000" },

    // Frappes, Shakes, and Lemonades
    { name: "Fresh Lime Water", category: "Cold Beverages", price: 30, imageUrl: "https://tse2.mm.bing.net/th?id=OIP.dunWN-LdQ9eKh4UlmWfHFwHaHa&pid=Api&P=0&h=220" },
    { name: "Lemon Ice Tea", category: "Cold Beverages", price: 60, imageUrl: "https://static.toiimg.com/photo/84339280.cms" },
    { name: "Lovely Lemonade", category: "Cold Beverages", price: 70, imageUrl: "https://recipes.net/wp-content/uploads/2020/03/lovely-lemonade-cocktail-recipe-1536x864.jpg" },
    { name: "Cool Blue Lemonade", category: "Cold Beverages", price: 70, imageUrl: "https://tse1.mm.bing.net/th?id=OIP.jdXgn8eVpSF-hXw4XkYSswHaLG&pid=Api&P=0&h=220" },
    { name: "Cold Coffee", category: "Cold Beverages", price: 80, imageUrl: "https://tse2.mm.bing.net/th?id=OIP._amtVrnWIHD-wQXNk2kxKQHaLH&pid=Api&P=0&h=220" },
    { name: "Vanilla Frappe", category: "Cold Beverages", price: 80, imageUrl: "https://tse4.mm.bing.net/th?id=OIP.-o0mf7eN8IFAMFDJyLOWVgHaLH&pid=Api&P=0&h=220" },
    { name: "Brownie Frappe", category: "Cold Beverages", price: 80, imageUrl: "https://static.wixstatic.com/media/4f5005_cfb8ab09d2254d849ac40a53e0df2309~mv2.jpg/v1/crop/x_511,y_0,w_1315,h_1501/fill/w_350,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/DSC00308%20copy_edited.jpg" },

    // Bakery Eats
    { name: "Aloo Puff", category: "Bakery", price: 20, imageUrl: "https://edesiadiaries.com/wp-content/uploads/2020/04/potato-peas-puff-ready-to-be-served-2.jpeg?w=1024" },
    { name: "Paneer Puff", category: "Bakery", price: 30, imageUrl: "https://edesiadiaries.com/wp-content/uploads/2020/04/potato-peas-puff-ready-to-be-served-2.jpeg?w=1024" },
    { name: "Masala Puff", category: "Bakery", price: 30, imageUrl: "https://www.google.com/imgres?q=masala%20puff%20image&imgurl=https%3A%2F%2Fb.zmtcdn.com%2Fdata%2Freviews_photos%2Fa91%2Fb581ea5fc4c0b2ae8421219be3c85a91_1550298538.jpg%3Ffit%3Daround%7C750%3A500%26crop%3D750%3A500%3B*%2C*&imgrefurl=https%3A%2F%2Fwww.zomato.com%2Ftr%2Fvadodara%2Fkalindi-masala-puff-kendranagar%2Fphotos%3Famp%3D1&docid=pIPhSQ0dr_HmJM&tbnid=dROL_K4kalU7nM&vet=12ahUKEwji28nAo46MAxViS2cHHeMDLIkQM3oECGkQAA..i&w=750&h=500&hcb=2&ved=2ahUKEwji28nAo46MAxViS2cHHeMDLIkQM3oECGkQAA" },
    { name: "Cheese Puff", category: "Bakery", price: 35, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBPO9hXhaVAoDhoogPk3jbP4vDFD7gSpIpLg&s" },
    { name: "Veg Burger", category: "Bakery", price: 70, imageUrl: "https://www.blondelish.com/wp-content/uploads/2019/02/Easy-Veggie-Burger-Recipe-Vegan-Healthy-11.jpg" },
    
    // Desserts
    { name: "Choco Rumball", category: "Desserts", price: 40, imageUrl: "https://img.taste.com.au/Oe_j77kn/taste/2016/11/chocolate-rum-balls-76104-1.jpeg" },
    { name: "Choco Black Forest Pastry", category: "Desserts", price: 60, imageUrl: "https://bakejunction.com/wp-content/uploads/2021/07/ai0a0205_H_E_lessBlaForstPastry-1.jpg" },

    // South Indian Food
    { name: "Plain Dosa", category: "South Indian", price: 60, imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/dosa-recipe.jpg" },
    { name: "Masala Dosa", category: "South Indian", price: 80, imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/masala-dosa-recipe.jpg" },

    // Chinese Food
    { name: "French Fry", category: "Chinese", price: 70, imageUrl: "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=1200&q=82&auto=format&fit=crop&dm=1662474181&s=687036746e03f50b6204c1390acdb537" },
    { name: "Momos", category: "Chinese", price: 80, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/800px-Momo_nepal.jpg" },

    // Maggi & Poha
    { name: "Ek-Dum Plain Maggi", category: "Maggi & Poha", price: 30, imageUrl: "https://5.imimg.com/data5/XG/IR/GLADMIN-60795231/maggie.png" },
    { name: "Poha", category: "Maggi & Poha", price: 30, imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/01/poha.jpg" },

    // Soups
    { name: "Sweet Corn", category: "Soups", price: 60, imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/sweet-corn-soup-recipe.jpg" },
    { name: "Hot N Sour", category: "Soups", price: 60, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz6bxlegNTvRSuirxgePHGj3DhrIg8P5Z9wQ&s" },

    // Combo
    { name: "Mini Meal", category: "Combo", price: 70, imageUrl: "https://img.freepik.com/premium-photo/indian-mini-meal-parcel-platter-combo-thali-with-gobi-masala-roti-dal-tarka-jeera-rice-salad_466689-87329.jpg" }
];

module.exports = products;
