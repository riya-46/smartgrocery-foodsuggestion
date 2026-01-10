import { useState } from "react";
import api from "../lib/api";

/* ================= COMMON DISEASES ================= */
const COMMON_DISEASES = [
  "Diabetes",
  "High BP",
  "Fever",
  "Acidity",
  "Thyroid",
];

/* ================= DISEASE → FOOD LOGIC ================= */
const DISEASE_FOOD_MAP = {
  Diabetes: {
    recommended: ["Oats", "Green Vegetables", "Dal", "Apple", "Curd"],
    avoid: ["Sugar", "White Rice", "Sweets", "Cold Drinks", "Bakery Items"],
    recipes: {
      Oats: "Vegetable Oats Porridge",
      "Green Vegetables": "Stir Fry Green Veggies",
      Dal: "Simple Dal Soup",
      Apple: "Apple Cinnamon Snack",
      Curd: "Plain Curd Bowl",
    },
  },

  "High BP": {
    recommended: ["Banana", "Leafy Greens", "Oats", "Garlic", "Fruits"],
    avoid: ["Salt", "Pickles", "Chips", "Fast Food", "Processed Food"],
    recipes: {
      Banana: "Banana Smoothie",
      "Leafy Greens": "Spinach Sabzi",
      Oats: "Oats Upma",
      Garlic: "Garlic Dal",
      Fruits: "Mixed Fruit Bowl",
    },
  },

  Fever: {
    recommended: ["Khichdi", "Soup", "Fruits", "Coconut Water", "Curd"],
    avoid: ["Fried Food", "Cold Drinks", "Spicy Food", "Outside Food", "Oil"],
    recipes: {
      Khichdi: "Simple Moong Dal Khichdi",
      Soup: "Vegetable Soup",
      Fruits: "Fruit Chaat",
      "Coconut Water": "Fresh Coconut Drink",
      Curd: "Curd Rice",
    },
  },

  Acidity: {
    recommended: ["Banana", "Oats", "Milk", "Curd", "Boiled Vegetables"],
    avoid: ["Spicy Food", "Tea", "Coffee", "Fried Food", "Tomato"],
    recipes: {
      Banana: "Banana Milk Shake",
      Oats: "Plain Oats Bowl",
      Milk: "Warm Milk",
      Curd: "Curd with Rice",
      "Boiled Vegetables": "Boiled Veg Salad",
    },
  },

  Thyroid: {
    recommended: ["Eggs", "Milk", "Curd", "Fruits", "Vegetables"],
    avoid: ["Soy", "Cabbage", "Cauliflower", "Fast Food", "Sugar"],
    recipes: {
      Eggs: "Boiled Eggs",
      Milk: "Milk with Turmeric",
      Curd: "Curd Bowl",
      Fruits: "Seasonal Fruits Plate",
      Vegetables: "Vegetable Curry",
    },
  },
};

export default function FoodForHealth() {
  const [member, setMember] = useState({
    name: "",
    age: "",
    gender: "",
    diseases: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  /* ================= TOGGLE DISEASE ================= */
  const toggleDisease = (disease) => {
    setMember((prev) => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter((d) => d !== disease)
        : [...prev.diseases, disease],
    }));
  };

  /* ================= GET SUGGESTIONS ================= */
  const getSuggestions = () => {
    setShowSuggestions(true);
    setShowRecipes(false);
  };

  /* ================= REAL DASHBOARD ADD ================= */
  const addItemToDashboard = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem("sg_user"));

      await api.post("/tx/add", {
        userEmail: user.email,
        itemName: item,
        quantity: 1,
        unit: "plate",
        price: 0,
        date: new Date().toISOString().slice(0, 10),
        mode: "Family",
      });

      alert(`"${item}" added to Dashboard`);
    } catch (err) {
      alert("Failed to add item");
    }
  };

  /* ================= SAVE RECIPE ================= */
  const saveRecipe = (recipe) => {
    setSavedRecipes((prev) => [
      ...prev,
      {
        id: Date.now(),
        memberName: member.name,
        recipe,
      },
    ]);
  };

  /* ================= DELETE RECIPE ================= */
  const deleteRecipe = (id) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  /* ================= MERGED FOOD DATA ================= */
  const recommendedFoods = [];
  const avoidFoods = [];
  const recipes = [];

  member.diseases.forEach((d) => {
    const data = DISEASE_FOOD_MAP[d];
    if (data) {
      recommendedFoods.push(...data.recommended);
      avoidFoods.push(...data.avoid);
      Object.values(data.recipes).forEach((r) => recipes.push(r));
    }
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>🥗 Food for Health</h2>

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h3>Family Member Details</h3>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          <input placeholder="Name" onChange={(e) => setMember({ ...member, name: e.target.value })} />
          <input type="number" placeholder="Age" onChange={(e) => setMember({ ...member, age: e.target.value })} />
          <select onChange={(e) => setMember({ ...member, gender: e.target.value })}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 150, flexWrap: "wrap" }}>
          {COMMON_DISEASES.map((d) => (
            <label
                      key={d}
                      style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                  }}
>
                  <input
                  type="checkbox"
                  onChange={() => toggleDisease(d)}
                     />
                 <span>{d}</span>
            </label>

          ))}
          <button onClick={getSuggestions}  
          style={{ 
            backgroundColor: "#ffffff", 
            color: "#24d241", 
            border: "4px solid #58e9a5", 
            padding: "8px 14px", 
            borderRadius: 6, 
            fontWeight: 800, 
            fontSize:20,
            cursor: "pointer", }}>
              🤖 Get AI Suggestions</button>
        </div>
      </div>

      {showSuggestions && (
        <>
          {/* ✅ Recommended Foods */}
          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>✅ Recommended Foods</h3>
            {[...new Set(recommendedFoods)].map((item) => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, }}>
                <span>{item}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => addItemToDashboard(item)}>Add</button>
                  <button onClick={() => setShowRecipes(true)}>Recipe</button>
                </div>
              </div>
            ))}
          </div>

          {/* ❌ Avoid Foods */}
          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>❌ Avoid Foods</h3>
            <ul>
              {[...new Set(avoidFoods)].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {/* 🍲 Recipes */}
          {showRecipes && (
            <div className="card" style={{ padding: 20, marginTop: 24 }}>
              <h3>🍲 Recipes for {member.name}</h3>
              {[...new Set(recipes)].map((r) => (
                <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12,  }}>
                  <span>{r}</span>
                  <button onClick={() => saveRecipe(r)}>Save</button>
                </div>
              ))}
            </div>
          )}

          {/* 📌 Saved Recipes */}
          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>📌 Saved Recipes</h3>

            {savedRecipes.length === 0 ? (
              <p>No recipes saved</p>
            ) : (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {savedRecipes.map((r) => (
                  <li
                    key={r.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>
                      <strong>{r.memberName}:</strong> {r.recipe}
                    </span>

                    <button
                      onClick={() => deleteRecipe(r.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
