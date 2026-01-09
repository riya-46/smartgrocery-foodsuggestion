import { useState } from "react";
import api from "../lib/api";

/*  COMMON DISEASES  */
const COMMON_DISEASES = [
  "Diabetes",
  "High BP",
  "Fever",
  "Acidity",
  "Thyroid",
];

/*  DISEASE → FOOD LOGIC  */
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
    customDisease: "",
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  /*  TOGGLE DISEASE  */
  const toggleDisease = (disease) => {
    setMember((prev) => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter((d) => d !== disease)
        : [...prev.diseases, disease],
    }));
  };

  /*  GET SUGGESTIONS  */
  const getSuggestions = () => {
    /*
      🔮 FUTURE AI INTEGRATION POINT
      --------------------------------
      yaha par hum:
      - Gemini API
      - OpenAI
      - ya apna ML model
      call karenge with:
      { age, gender, diseases }
    */
    setShowSuggestions(true);
  };

  /*  REAL DASHBOARD ADD  */
  const addItemToDashboard = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem("sg_user"));

      await api.post("/tx/add", {
        userEmail: user.email,
        itemName: item,
        quantity: 1,
        //unit: "plate",
        price: 0,
        date: new Date().toISOString().slice(0, 10),
        mode: "Family",
      });

      alert(`"${item}" added to Dashboard`);
    } catch (err) {
      alert("Failed to add item");
    }
  };

  /*  SAVE RECIPE  */
  const saveRecipe = (recipe) => {
    setSavedRecipes((prev) => [
      ...prev,
      `${member.name}: ${recipe}`,
    ]);
  };

  /*  MERGED FOOD DATA  */
  const selectedDiseases = member.diseases;
  const recommendedFoods = [];
  const avoidFoods = [];
  const recipes = [];

  selectedDiseases.forEach((d) => {
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
      <p style={{ color: "#555" }}>
        Health-based food & recipe suggestions
      </p>

      {/*  MEMBER INPUT BLOCK  */}
<div className="card" style={{ padding: 20, marginTop: 20 }}>
  <h3>Family Member Details</h3>

  {/* NAME / AGE / GENDER — ONE LINE */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 12,
      marginBottom: 16,
    }}
  >
    <input
      placeholder="Name"
      value={member.name}
      onChange={(e) =>
        setMember({ ...member, name: e.target.value })
      }
      style={{ padding: 8 }}
    />

    <input
      type="number"
      placeholder="Age"
      value={member.age}
      onChange={(e) =>
        setMember({ ...member, age: e.target.value })
      }
      style={{ padding: 8 }}
    />

    <select
      value={member.gender}
      onChange={(e) =>
        setMember({ ...member, gender: e.target.value })
      }
      style={{ padding: 8 }}
    >
      <option value="">Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>

  {/* DISEASES  */}
<h4 style={{ marginBottom: 8 }}>Diseases</h4>

<div
  style={{
    display: "flex",
    gap: 100,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  }}
>
  {COMMON_DISEASES.map((d) => (
    <label
      key={d}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={member.diseases.includes(d)}
        onChange={() => toggleDisease(d)}
      />
      {d}
    </label>
  ))}

   {/* AI BUTTON */}
  
    <button
      onClick={getSuggestions}
      style={{
        padding: "10px 22px",
        background: "#22c55e",
        color: "#fff",
        border: "none",
        borderRadius: 20,
        fontSize: 15,
        cursor: "pointer",
      }}
    >
      🤖 Get AI Suggestions
    </button>
  

</div>

  
</div>


      {/*  SUGGESTIONS  */}
      {showSuggestions && (
        <>
          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>✅ Recommended Foods</h3>
            {[...new Set(recommendedFoods)].map((item) => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item}</span>
                <button onClick={() => addItemToDashboard(item)}>
                  Add to Dashboard
                </button>
              </div>
            ))}

            <h3 style={{ marginTop: 16 }}>❌ Avoid Foods</h3>
            <ul>
              {[...new Set(avoidFoods)].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>🍲 Recipes for {member.name}</h3>
            {[...new Set(recipes)].map((r) => (
              <div key={r} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{r}</span>
                <button onClick={() => saveRecipe(r)}>Save</button>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20, marginTop: 24 }}>
            <h3>📌 Saved Recipes</h3>
            {savedRecipes.length === 0 ? (
              <p>No recipes saved</p>
            ) : (
              <ul>
                {savedRecipes.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}