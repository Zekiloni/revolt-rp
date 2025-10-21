# Organizations & Factions System

---

## 1. Creating & Joining Organizations

- Organizations can be:
  - **Legal** (businesses, companies, news agencies)
  - **Government / Public Service** (BCSO, Blaine County Fire & Rescue, City Hall)
  - **Illegal** (gangs, cartels, mafia, motorcycle clubs etc.)
- Players can join via command invitation by a higher-ranked member.

---

## 2. Organization Panel (Home Menu)

You can access your organization via:
- **`HOME` Menu → Organizations**, or
- Command: **`/org`**, or

Inside the organization panel you can:
- View **members list**
- See **online members**
- View **organization bank balance**
- Create or edit **ranks**
- Set **wages / salaries**
- Manage **permissions & roles**
- Access **activity logs (ABAS)** and many other features

---

## 3. Ranks & Permissions

| Feature | Description |
|---------|-------------|
| Create ranks | Yes |
| Custom rank names | Yes |
| Set permissions per rank | Invite, fire, access, manage money, etc. |
| Salaries | Set as **percentage-based** income or fixed amount |
| Sub-organizations | One organization can have a **parent** (main) and **child divisions** script wise |

---

## 4. Organization Commands

| Command | Description |
|---------|-------------|
| `/org` | Opens organization panel |
| `/f` | Faction / organization chat |
| `/invite [ID]` | Invite player to the organization |
| `/uninvite [ID]` | Remove player from the organization |
| `/leaveorganization` | Leave the organization |
| `/o` | Same as /f (organization chat) |

---

## ✅ 5. Member Activity System (ABAS)

- ABAS = **Activity-Based Attendance System**
- Tracks:
  - Player’s login time
  - Duty time (for legal factions like BCSO)
  - Salary calculations
  - Inactivity detection

---

## 6. Parent & Sub-Organizations

Organizations can have:
- **Parent organization** (example: Government of Blaine County)
- **Sub-organization** (example: City Hall → Office of Public Works)

This allows hierarchy and structure within the same faction/business.

---

## 7. Quitting or Removing Members

| Action | Result |
|--------|--------|
| `/leaveorganization` | Player leaves voluntarily |
| `/uninvite [ID]` | Member is removed by higher rank |
| If leader leaves | Leadership must be transferred first |

---
