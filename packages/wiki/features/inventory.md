# Inventory System

The inventory system is designed to be simple, realistic, and fully integrated with gameplay mechanics, items, weapons, and interactions.

---

## 1. Opening the Inventory

- Press **`I`** to open or close the inventory.
- Items are displayed in a grid-based UI.
- Each slot represents **one item** or **a stack of items**.
- Maximum capacity:
  - **20 inventory slots**, or
  - **Weight limit between 15–20 kg**

> ⚠ If the inventory is full or exceeds weight, items cannot be looted or picked up.

---

## 2. Item Details & UI

- Hovering the cursor over an item shows:
  - **Item name**
  - **Description**
  - **Weight**
  - **Durability / Ammo (if applicable)**

---

## 3. Item Actions (Right-Click / Interaction Menu)

When you click on an item in the inventory, the following actions can appear depending on the type of item:

| Action     | Description |
|------------|-------------|
| **Equip**  | Equips weapons, clothing, armor, tools. |
| **Use**    | Consumes or activates the item (food, drink, card, toolkit, etc.). |
| **Give**   | Transfers the item to another player. |
| **Split**  | If the item is stackable, you can divide a stack (e.g. ammo, drugs). |
| **Drop**   | Drops the item on the ground as a world object. |
| **Destroy**| Permanently deletes the item from inventory. |

### Clothing Behavior
- Removing clothes places them back in inventory. 
- Dropping clothes places them **on the ground** as world objects.
- Equipping clothing instantly updates your character model.

---

## 4. Quick Slots (1–5)

- The **first 5 inventory slots** are **Quick Access Slots**.
- Items placed here can be used with **keys 1, 2, 3, 4, 5**.
- **Weapons** equipped in quick slots:
  - Press the slot number → weapon is drawn and placed in hand.
  - Press again → weapon is holstered.
- **Other items** (flashlight, radio, camera, phone etc.) are also activated from quick slots or from inventory.

---

## 5. Interactive Items & World Use

Certain items only work when near valid objects or environments:

**Example:**
- Bank Card must be used near an ATM or inside a bank.

---

## 6. Item Types (Overview)

- Items are unique which means that you can give phone, card etc. to other players. They will be able to use items as in real life.
- There are different item types. Examples are shown in the table below:

| Type          | Examples                            | Notes                              |
|---------------|--------------------------------------|-------------------------------------|
| **Weapon**    | Pistols, rifles, melees             | Requires ammo  |
| **Ammo**      | 9mm, .45, 5.56, shotgun shells      | Stackable                           |
| **Consumable**| Water, food, pills, alcohol         | Affects hunger, thirst, health     |
| **Utility**   | Radio, phone, binoculars, toolbox   | Used manually or via keybind       |
| **Clothing**  | Shirts, pants, hats, masks          | Dropped to ground when removed     |
| **Documents** | ID card, bank card, licenses        | Unique to each character           |

---