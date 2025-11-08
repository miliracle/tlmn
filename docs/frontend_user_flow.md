# Frontend User Flow - Tiến Lên Miền Nam

## Overview
This document describes the user flow and navigation structure for the Tiến Lên Miền Nam web application. The application is designed with a **mobile-first** approach, prioritizing mobile user experience while maintaining desktop compatibility.

---

## Layout Structure

### Main Layout Components

```
┌─────────────────────────────────┐
│         Top Bar / Header        │  (Optional: Round info, Settings)
├─────────────────────────────────┤
│                                 │
│      Main Content Area          │
│      (Table List / Game Board)  │
│                                 │
│                                 │
├─────────────────────────────────┤
│      Bottom Menu Bar            │  (Always visible on mobile)
│  [User] [Tables] [My Bot]       │
└─────────────────────────────────┘
```

---

## Bottom Menu Bar (Navigation)

The bottom menu bar is **always visible** on mobile devices and provides primary navigation:

### Menu Items (Left to Right):

1. **User Info / Login / Signup** (Left)
   - **When logged out:**
     - Icon: User profile icon
     - Tap → Opens login/signup modal or navigates to login page
     - Shows "Login" or "Sign Up" text/icon
   
   - **When logged in:**
     - Icon: User avatar or profile picture
     - Tap → Opens user profile menu/drawer OR navigates to User Info page
     - Shows username or avatar
     - Menu options (if drawer):
       - View Profile (navigates to `/profile`)
       - Game History
       - Settings
       - Logout
     - Direct navigation: Tap → Goes to User Info page (`/profile`)

2. **Table List** (Center)
   - Icon: Grid/List icon
   - Tap → Navigates to Table List page (home)
   - Active state when on table list page
   - Shows badge if user has active tables

3. **My Bot** (Right)
   - Icon: Robot/Bot icon
   - Tap → Navigates to Bot Editor page
   - Shows "Coming Soon" badge/indicator (if not implemented)
   - Disabled state with visual indicator when not available

---

## User Flow: Landing Page (Future Implementation)

### Entry Point
- **URL:** `/`
- **Route:** `index.tsx`
- **Component:** `LandingPage.tsx`
- **Status:** ⏳ To be implemented later

### Purpose
The landing page will serve as the marketing/onboarding entry point for new users, featuring:
- Game introduction and rules overview
- Call-to-action buttons (Get Started, Learn More)
- Feature highlights
- Screenshots/demo
- Navigation to login/register or table list

### Current Behavior
- Currently, the root route (`/`) redirects to `/tables` (Table List page)
- This redirect will be removed once the landing page is implemented

---

## User Flow: Table List Page

### Entry Point
- **URL:** `/tables`
- **Route:** `tables.tsx` (or redirect from `/`)
- **Component:** `TableListPage.tsx`
- **Note:** Currently acts as the default home page until landing page is implemented

### Layout Structure

```
┌─────────────────────────────────┐
│      Table List Header          │
│  [Create Table] [Filter/Search] │
├─────────────────────────────────┤
│                                 │
│    ┌─────┐  ┌─────┐  ┌─────┐    │
│    │Table│  │Table│  │Table│    │
│    │  1  │  │  2  │  │  3  │    │
│    └─────┘  └─────┘  └─────┘    │
│                                 │
│    ┌─────┐  ┌─────┐  ┌─────┐    │
│    │Table│  │Table│  │Table│    │
│    │  4  │  │  5  │  │  6  │    │
│    └─────┘  └─────┘  └─────┘    │
│                                 │
│         Grid View (2-3 cols)    │
│                                 │
├─────────────────────────────────┤
│  [< Prev]  Page 1/5  [Next >]   │  Pagination
├─────────────────────────────────┤
│  [User] [Tables] [My Bot]       │  Bottom Menu
└─────────────────────────────────┘
```

### Table Card (Grid Item)

Each table card displays:
- **Table Name** (or "Table #123")
- **Player Count** (e.g., "2/4 players")
- **Status Badge:**
  - 🟢 Waiting (has empty slots)
  - 🟡 In Progress (game active)
  - ⚪ Full (all slots filled, waiting to start)
- **Game Mode** (Casual, Bot Arena, Hybrid, Practice)
- **Host Avatar/Name**
- **Join Button** (if not full and user not in table)

### User Actions on Table List

1. **Create Table**
   - Tap "Create Table" button (top of page)
   - Opens table creation modal/form (see [Create Table Modal/Form](#user-flow-create-table-modalform) section for details)
   - User configures:
     - Player count (2-4)
     - Game mode (Casual, Bot Arena, Hybrid, Practice)
     - Session length (16/32 games)
     - Table name (optional)
     - Privacy settings (Public/Private)
   - On submit → Creates table → Navigates to table lobby

2. **Join Table**
   - Tap on a table card
   - If table has space → Joins table → Navigates to table lobby
   - If table is full → Shows error message
   - If user already in table → Navigates to table lobby

3. **View Table Details**
   - Long press or tap info icon on table card
   - Shows table details modal:
     - Current players
     - Game mode
     - Session progress
     - Share link

4. **Pagination**
   - Swipe or tap pagination controls
   - Loads next/previous page of tables
   - Shows current page number
   - Infinite scroll option (optional)

5. **Filter/Search**
   - Filter by:
     - Status (Waiting, In Progress, Full)
     - Game Mode
     - Player Count
   - Search by table name or host name

---

## User Flow: Create Table Modal/Form

### Entry Point
- **Trigger:** Tap "Create Table" button on Table List page
- **Component:** `CreateTableModal.tsx` or `CreateTableForm.tsx`
- **Display:** Full-screen modal on mobile, centered modal on desktop

### Layout Structure (Mobile-Optimized)

```
┌─────────────────────────────────┐
│  ← Back    Create Table    [X]  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │  Table Name (Optional)    │  │
│  │  [___________________]     │  │
│  │  Leave empty for default  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Number of Players        │  │
│  │  ┌──┐  ┌──┐  ┌──┐  ┌──┐  │  │
│  │  │ 2│  │ 3│  │ 4│  │ 4│  │  │
│  │  └──┘  └──┘  └──┘  └──┘  │  │
│  │  (Selected: 4)            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Game Mode                │  │
│  │  ┌──────────┐              │  │
│  │  │ Casual   │  (Selected) │  │
│  │  └──────────┘              │  │
│  │  ┌──────────┐              │  │
│  │  │ Bot Arena│              │  │
│  │  └──────────┘              │  │
│  │  ┌──────────┐              │  │
│  │  │ Hybrid   │              │  │
│  │  └──────────┘              │  │
│  │  ┌──────────┐              │  │
│  │  │ Practice │              │  │
│  │  └──────────┘              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Session Length            │  │
│  │  ┌──────────┐              │  │
│  │  │ 16 Games │  (Selected)  │  │
│  │  └──────────┘              │  │
│  │  ┌──────────┐              │  │
│  │  │ 32 Games │              │  │
│  │  └──────────┘              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Privacy Settings          │  │
│  │  ☑ Public (anyone can join)│ │
│  │  ☐ Private (invite only)   │  │
│  └───────────────────────────┘  │
│                                 │
│  [Cancel]        [Create Table] │
│                                 │
└─────────────────────────────────┘
```

### Form Fields

1. **Table Name** (Optional)
   - **Type:** Text input
   - **Placeholder:** "Table #123" or "My Game Table"
   - **Default:** Auto-generated if left empty
   - **Validation:** 
     - Max length: 50 characters
     - Allowed characters: letters, numbers, spaces, hyphens
   - **Helper Text:** "Leave empty for auto-generated name"

2. **Number of Players**
   - **Type:** Radio buttons or segmented control
   - **Options:** 2, 3, or 4 players
   - **Default:** 4 players
   - **Visual:** Large, touch-friendly buttons
   - **Display:** Shows selected count prominently

3. **Game Mode**
   - **Type:** Radio buttons or card selection
   - **Options:**
     - **Casual:** Play with other players (default)
     - **Bot Arena:** Play against bots only
     - **Hybrid:** Mix of players and bots
     - **Practice:** Solo practice mode (if available)
   - **Visual:** Card-style selection with icons
   - **Helper Text:** Brief description under each option
   - **Default:** Casual

4. **Session Length**
   - **Type:** Radio buttons or segmented control
   - **Options:** 
     - 16 games (shorter session)
     - 32 games (longer session)
   - **Default:** 16 games
   - **Helper Text:** Estimated duration (e.g., "~30 minutes" for 16 games)

5. **Privacy Settings** (Optional)
   - **Type:** Checkbox or toggle
   - **Options:**
     - **Public:** Anyone can join (default)
     - **Private:** Invite-only (requires invite link)
   - **Default:** Public
   - **Note:** Private tables may require additional setup (invite link generation)

### User Actions

1. **Fill Form**
   - User selects/taps options
   - Real-time validation feedback
   - Selected options highlighted visually
   - Form state saved to Redux draft (optional, for recovery)

2. **Cancel**
   - Tap "Cancel" or back button
   - Shows confirmation if form has changes
   - Closes modal
   - Returns to Table List page

3. **Create Table**
   - Tap "Create Table" button
   - Validates all required fields
   - Shows loading state (button disabled, spinner)
   - On success:
     - Creates table via API mutation
     - Navigates to table lobby (`/tables/:tableId`)
     - Shows success notification
   - On error:
     - Shows error message
     - Keeps modal open
     - Highlights error fields

### Validation Rules

- **Table Name:**
  - Optional field
  - If provided: 1-50 characters
  - No special characters except hyphens and spaces
  - Trimmed of leading/trailing spaces

- **Number of Players:**
  - Required
  - Must be 2, 3, or 4

- **Game Mode:**
  - Required
  - Must be one of: Casual, Bot Arena, Hybrid, Practice

- **Session Length:**
  - Required
  - Must be 16 or 32 games

### Mobile-Optimized Features

- **Full-Screen Modal:** On mobile (< 768px), modal takes full screen
- **Large Touch Targets:** All buttons and options are at least 44x44px
- **Swipe to Dismiss:** Swipe down to close modal (with confirmation if form has changes)
- **Keyboard Handling:** 
  - Text input focuses properly
  - Keyboard doesn't cover form fields
  - "Done" button on keyboard closes keyboard
- **Scrollable:** Form scrolls if content exceeds screen height
- **Auto-Save Draft:** Form state saved to Redux (optional) to recover if user accidentally closes

### Desktop-Optimized Features

- **Centered Modal:** Modal appears centered on screen
- **Max Width:** Modal has max-width (e.g., 500px) for better readability
- **Keyboard Navigation:** 
  - Tab through fields
  - Enter to submit
  - Escape to cancel
- **Hover States:** Visual feedback on hover for all interactive elements

### Error Handling

- **Inline Validation:** 
  - Real-time validation as user types/selects
  - Error messages appear below fields
  - Fields highlighted in red if invalid

- **Submit Validation:**
  - All errors shown at once on submit attempt
  - Scroll to first error field
  - Error summary at top (optional)

- **API Errors:**
  - Network errors: "Unable to connect. Please try again."
  - Validation errors: Show specific field errors from server
  - Server errors: "Something went wrong. Please try again later."

### Success Flow

1. User taps "Create Table"
2. Loading state shown
3. API call succeeds
4. Table created
5. Modal closes
6. Navigation to `/tables/:tableId` (Table Lobby)
7. Success notification: "Table created successfully!"

### State Management

- **Form State:** Stored in Redux `uiSlice.formDrafts['createTable']` (optional, for draft recovery)
- **Mutation:** Uses TanStack Query `useCreateTable` mutation
- **On Success:** 
  - Invalidates `queryKeys.tables.all()` to refresh table list
  - Sets `currentTableId` in Redux `gameSlice`
  - Navigates to table lobby

---

## User Flow: Table Lobby Page

### Entry Point
- **URL:** `/tables/:tableId`
- **Route:** `tables.$tableId.tsx`
- **Component:** `TableLobbyPage.tsx`

### Layout Structure

```
┌─────────────────────────────────┐
│  ← Back    Table Name    Share  │
├─────────────────────────────────┤
│                                 │
│    Player Slots (Grid 2x2)      │
│  ┌──────┐      ┌──────┐         │
│  │Slot 1│      │Slot 2│         │
│  │[User]│      │Empty │         │
│  │Ready │      │      │         │
│  └──────┘      └──────┘         │
│                                 │
│  ┌──────┐      ┌──────┐         │
│  │Slot 3│      │Slot 4│         │
│  │[Bot] │      │Empty │         │
│  │Ready │      │      │         │
│  └──────┘      └──────┘         │
│                                 │
│  Table Settings Panel           │
│  - Game Mode: Casual            │
│  - Session: 16 games            │
│  - Players: 2/4                 │
│                                 │
│  [Add Bot] [Ready] [Start Game] │
│                                 │
├─────────────────────────────────┤
│  [User] [Tables] [My Bot]       │
└─────────────────────────────────┘
```

### User Actions in Lobby

1. **Ready/Unready**
   - Tap "Ready" button
   - Toggles ready status
   - Visual indicator on player slot

2. **Add Bot** (Host only - Coming soon - Disabled)
   - Tap "Add Bot" button
   - Opens bot selection modal
   - Select bot from user's bots
   - Bot appears in empty slot

3. **Remove Player/Bot** (Host only)
   - Long press on player slot
   - Shows remove option
   - Confirms removal

4. **Start Game** (Host only)
   - Enabled when all slots filled and all players ready
   - Tap → Starts game → Navigates to game board

5. **Leave Table**
   - Tap "Leave" or back button
   - Confirms leave action
   - Returns to table list

6. **Share Table**
   - Tap share icon
   - Copies table link to clipboard
   - Shows share options (if available)

---

## User Flow: Game Board Page

### Entry Point
- **URL:** `/tables/:tableId/game` (or embedded in table page)
- **Component:** `GameBoardPage.tsx`

### Layout Structure (Mobile-Optimized)

```
┌─────────────────────────────────┐
│  Round 1  Game 1/16  [Settings] │
├─────────────────────────────────┤
│                                 │
│      Opponent 1 (Top)           │
│      Cards: 8                   │
│                                 │
│  ┌───────────────┐              │
│  │  Last Play    │              │
│  │  [Cards...]   │              │
│  └───────────────┘              │
│                                 │
│  Opponent 2    Opponent 3       │
│  (Left)        (Right)          │
│                                 │
│      Your Hand (Bottom)         │
│  [Card][Card][Card]...[Card]    │
│                                 │
│  [Play] [Pass] [Sort] [Suggest] │
│                                 │
├─────────────────────────────────┤
│  [User] [Tables] [My Bot]       │
└─────────────────────────────────┘
```

### User Actions During Game

1. **Select Cards**
   - Tap cards in hand to select
   - Selected cards highlighted
   - Can deselect by tapping again

2. **Play Cards**
   - Select cards → Tap "Play"
   - Validates move
   - If valid → Plays cards
   - If invalid → Shows error message

3. **Pass Turn**
   - Tap "Pass" button
   - Skips turn
   - Cannot play again in same round

4. **Auto-Sort**
   - Tap "Sort" button
   - Sorts hand by rank and suit

5. **Get Suggestion**
   - Tap "Suggest" button
   - Highlights valid moves
   - Shows combination type

6. **View Game Info**
   - Tap settings icon
   - Opens sidebar with:
     - Game log
     - Score board
     - Chat
     - Leave game option

---

## User Flow: Authentication

### Login Flow

1. **Entry Point:**
   - Tap User icon in bottom menu (when logged out)
   - Or navigate to `/login`

2. **Login Page:**
   ```
   ┌─────────────────────────────────┐
   │            Login                │
   ├─────────────────────────────────┤
   │  Username/Email: [________]     │
   │  Password:       [________]     │
   │                                 │
   │  [Login]                        │
   │                                 │
   │  Don't have account?            │
   │  [Sign Up]                      │
   └─────────────────────────────────┘
   ```

3. **After Login:**
   - Validates credentials
   - Stores JWT token
   - Updates user state
   - Redirects to table list or previous page

### Registration Flow

1. **Entry Point:**
   - Tap "Sign Up" on login page
   - Or navigate to `/register`

2. **Register Page:**
   ```
   ┌─────────────────────────────────┐
   │          Sign Up                │
   ├─────────────────────────────────┤
   │  Username:      [________]      │
   │  Email:         [________]      │
   │  Password:      [________]      │
   │  Confirm:       [________]      │
   │                                 │
   │  [Create Account]               │
   │                                 │
   │  Already have account?          │
   │  [Login]                        │
   └─────────────────────────────────┘
   ```

3. **After Registration:**
   - Creates account
   - Auto-logs in
   - Redirects to table list

---

## User Flow: User Info / Profile Page

### Entry Point
- **URL:** `/profile` or `/user`
- **Route:** `profile.tsx` or `user.tsx`
- **Component:** `UserInfoPage.tsx` or `ProfilePage.tsx`
- **Access:** Requires authentication (redirects to login if not logged in)

### Navigation
- Tap User icon in bottom menu (when logged in)
- Opens user profile menu/drawer → Tap "View Profile"
- Or navigate directly to `/profile`

### Layout Structure

```
┌─────────────────────────────────┐
│  ← Back    Profile    [Settings]│
├─────────────────────────────────┤
│                                 │
│      ┌──────────────┐           │
│      │   Avatar     │           │
│      │   [Image]    │           │
│      │              │           │
│      │  Username    │           │
│      │  @username   │           │
│      └──────────────┘           │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Statistics               │  │
│  ├───────────────────────────┤  │
│  │  Games Played:    42      │  │
│  │  Games Won:       15      │  │
│  │  Win Rate:        35.7%   │  │
│  │  Total Points:    +125    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  My Bots                  │  │
│  ├───────────────────────────┤  │
│  │  Bot Count:         3     │  │
│  │  [View All Bots →]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Recent Games             │  │
│  ├───────────────────────────┤  │
│  │  Game #123  - Won  +15    │  │
│  │  Game #122  - Lost  -8    │  │
│  │  Game #121  - Won  +12    │  │
│  │  [View All Games →]       │  │
│  └───────────────────────────┘  │
│                                 │
│  [Edit Profile] [Change Password]│
│                                 │
├─────────────────────────────────┤
│  [User] [Tables] [My Bot]       │
└─────────────────────────────────┘
```

### User Information Display

1. **Profile Header**
   - User avatar/profile picture
   - Username
   - User ID or handle
   - Account creation date
   - Online/offline status (if applicable)

2. **Statistics Section**
   - **Games Played:** Total number of games completed
   - **Games Won:** Number of games won
   - **Win Rate:** Percentage of games won
   - **Total Points:** Cumulative points across all games
   - **Best Score:** Highest single game score
   - **Average Score:** Average points per game
   - **Current Rank:** Ranking position (if leaderboard exists)

3. **My Bots Section**
   - Total number of bots created
   - Quick preview of bot count
   - Link to Bot Editor page
   - Shows "Coming Soon" if bot feature not available

4. **Recent Games Section**
   - List of last 3-5 games played
   - Game ID, date, result (Won/Lost), points
   - Link to full game history
   - Shows game details on tap

### User Actions

1. **Edit Profile**
   - Tap "Edit Profile" button
   - Opens edit form modal/page
   - Can update:
     - Username (if allowed)
     - Avatar/profile picture
     - Bio/description (if applicable)
     - Display preferences
   - Saves changes to backend

2. **Change Password**
   - Tap "Change Password" button
   - Opens password change form
   - Requires current password
   - Validates new password strength
   - Updates password on backend

3. **View Game History**
   - Tap "View All Games" or game item
   - Navigates to game history page
   - Shows paginated list of all games
   - Filter by date, result, points
   - View game details/replay

4. **View All Bots**
   - Tap "View All Bots" or bot count
   - Navigates to Bot Editor page
   - Shows all user's bots

5. **Logout**
   - Available in settings menu or profile menu
   - Confirms logout action
   - Clears authentication token
   - Redirects to login or table list

### Settings Menu (Optional)

If settings icon is present in header:
- **Account Settings**
  - Edit profile
  - Change password
  - Email preferences
  - Notification settings

- **Game Settings**
  - Sound effects toggle
  - Animation preferences
  - Card display options
  - Language selection

- **Privacy Settings**
  - Profile visibility
  - Game history visibility
  - Data sharing preferences

### Mobile-Optimized Features

- **Swipe Gestures:**
  - Swipe left/right to navigate between sections
  - Pull to refresh statistics

- **Collapsible Sections:**
  - Tap section header to expand/collapse
  - Saves space on mobile screens

- **Quick Actions:**
  - Long press on avatar to change picture
  - Swipe down on header to refresh data

---

## User Flow: Bot Editor Page - Coming Soon - Not implement now

### Entry Point
- **URL:** `/bots`
- **Route:** `bots.tsx`
- **Component:** `BotEditorPage.tsx`

### Layout Structure

```
┌─────────────────────────────────┐
│  ← Back    My Bots    [New Bot] │
├─────────────────────────────────┤
│                                 │
│  Bot List (Left Panel)          │
│  - Bot 1                        │
│  - Bot 2                        │
│  - Bot 3                        │
│                                 │
│  Code Editor (Center)           │
│  ┌─────────────────────────-┐   │
│  │ function getNextMove() { │   │
│  │   // Bot code...         │   │
│  │ }                        │   │
│  └─────────────────────────-┘   │
│                                 │
│  [Save] [Test] [Delete]         │
│                                 │
│  API Docs (Right Panel)         │
│  - Game State API               │
│  - Return Format                │
│                                 │
├─────────────────────────────────┤
│  [User] [Tables] [My Bot]       │
└─────────────────────────────────┘
```

### User Actions

1. **Create Bot**
   - Tap "New Bot" button
   - Opens bot creation form
   - Enter name, description
   - Loads template code

2. **Edit Bot**
   - Select bot from list
   - Code loads in editor
   - Edit code
   - Save changes

3. **Test Bot**
   - Tap "Test" button
   - Runs bot with sample game state
   - Shows results in console panel

4. **Delete Bot**
   - Long press on bot in list
   - Confirms deletion
   - Removes bot

---

## Navigation Flow Diagram

```
                    ┌─────────────┐
                    │   App Start │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Redirect   │
                    │   to /tables│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Table List │ ◄──┐
                    │   (/tables) │    │
                    └──────┬──────┘    │
                           │           │
        ┌──────────────────┼───────────┘
        │                  │
        │                  │
   ┌────▼────┐      ┌──────▼──────┐
   │  Login  │      │ Table Lobby │
   │ Register│      └──────┬──────┘
   └────┬────┘             │
        │                  │
        │            ┌─────▼──────-┐
        │            │ Game Board  │
        │            └─────────────┘
        │
   ┌────▼────┐      ┌──────▼───-───┐
   │  User   │      │   Bot        │
   │ Profile │      │   Editor     │
   └─────────┘      └──────────────┘

Note: Landing Page (/) will be implemented later.
      Currently, root route redirects to /tables.
```

---

## Responsive Design Notes

### Mobile (< 768px)
- Bottom menu bar always visible
- Single column table list
- Full-screen modals for forms
- Swipe gestures for navigation
- Touch-optimized buttons (min 44x44px)

### Tablet (768px - 1024px)
- 2-3 column table grid
- Sidebar for game info
- Bottom menu or top navigation

### Desktop (> 1024px)
- 3-4 column table grid
- Top navigation bar (bottom menu optional)
- Sidebar panels
- Hover states for interactions

---

## State Management

This application uses a **dual-state management approach**:
- **Redux (Redux Toolkit)** for UI/Client State
- **TanStack Query (React Query)** for Server State

### Principles

**Redux (UI State)** should store:
- ✅ Client-side only data (not from server)
- ✅ Ephemeral UI state (modals, selections, temporary data)
- ✅ User preferences and settings
- ✅ Real-time WebSocket connection state
- ✅ Optimistic UI updates (before server confirmation)
- ❌ **NOT** server-fetched data
- ❌ **NOT** cacheable API responses

**TanStack Query (Server State)** should store:
- ✅ All data fetched from REST API
- ✅ Cacheable server data
- ✅ Data that needs refetching/background updates
- ✅ Paginated data
- ✅ Data with relationships (tables, games, users)
- ❌ **NOT** UI-only state
- ❌ **NOT** temporary form inputs

---

## Redux State (UI/Client State)

### 1. UI Slice (`uiSlice`)

**Purpose:** Manage UI presentation and user interface state

**State Structure:**
```typescript
interface UiState {
  // Navigation & Layout
  sidebarOpen: boolean;              // Sidebar visibility
  bottomMenuActiveItem: 'user' | 'tables' | 'bot' | null;  // Active bottom menu item
  currentModal: string | null;         // Currently open modal ID
  modalStack: string[];                // Stack of open modals
  
  // Theme & Appearance
  theme: 'light' | 'dark';            // App theme
  cardDisplayMode: 'compact' | 'normal' | 'large';  // Card size preference
  
  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    timestamp: number;
    autoHide?: boolean;
  }>;
  
  // Loading States (UI-level, not data loading)
  isPageTransitioning: boolean;        // Page transition animation
  isDragging: boolean;                 // Drag operation in progress
  
  // Form State (temporary, before submission)
  formDrafts: Record<string, any>;    // Unsaved form data by form ID
  
  // UI Preferences
  soundEnabled: boolean;              // Sound effects toggle
  animationsEnabled: boolean;         // Animation toggle
  showCardCounts: boolean;            // Show/hide opponent card counts
}
```

**Actions:**
- `toggleSidebar()` - Toggle sidebar visibility
- `setBottomMenuActive(item)` - Set active bottom menu item
- `openModal(modalId)` - Open a modal
- `closeModal(modalId)` - Close a modal
- `setTheme(theme)` - Change theme
- `addNotification(notification)` - Add toast notification
- `removeNotification(id)` - Remove notification
- `setFormDraft(formId, data)` - Save form draft
- `clearFormDraft(formId)` - Clear form draft

---

### 2. Game UI Slice (`gameSlice`)

**Purpose:** Manage game-related UI state and WebSocket connection

**State Structure:**
```typescript
interface GameState {
  // Current Context
  currentTableId: string | null;      // Currently viewed/joined table
  currentGameId: string | null;        // Currently active game
  
  // WebSocket Connection
  isConnected: boolean;                // WebSocket connection status
  connectionError: string | null;      // Last connection error
  
  // Game UI State (not game data itself)
  selectedCards: string[];              // Selected card IDs in hand
  isSortingHand: boolean;               // Hand sorting animation state
  showSuggestions: boolean;            // Show move suggestions
  suggestedMoves: Array<{              // Suggested valid moves
    cards: string[];
    type: string;
  }> | null;
  
  // Turn UI State
  turnTimer: number | null;             // Current turn timer (seconds)
  isMyTurn: boolean;                    // Is it current user's turn
  canPlay: boolean;                     // Can user play (has valid move)
  canPass: boolean;                     // Can user pass
  
  // Game Board UI
  lastPlayAnimation: 'playing' | 'complete' | null;  // Last play animation state
  roundTransitionAnimation: boolean;   // Round transition animation
  
  // Optimistic Updates (before server confirmation)
  optimisticPlay: {                     // Optimistic card play
    cards: string[];
    timestamp: number;
  } | null;
}
```

**Actions:**
- `setCurrentTable(tableId)` - Set current table context
- `setCurrentGame(gameId)` - Set current game context
- `setConnected(status)` - Update WebSocket connection status
- `selectCard(cardId)` - Select/deselect a card
- `selectCards(cardIds)` - Select multiple cards
- `clearSelection()` - Clear all selected cards
- `setSuggestedMoves(moves)` - Set move suggestions
- `setTurnTimer(seconds)` - Update turn timer
- `setOptimisticPlay(cards)` - Set optimistic play (before server confirms)
- `clearOptimisticPlay()` - Clear optimistic play

---

### 3. Auth Slice (`authSlice`) - Recommended Addition

**Purpose:** Manage authentication UI state (NOT user data from server)

**State Structure:**
```typescript
interface AuthState {
  // Authentication Status (UI state)
  isAuthenticated: boolean;            // Auth status (derived from token)
  token: string | null;                 // JWT token (stored in localStorage, synced here)
  tokenExpiry: number | null;           // Token expiry timestamp
  
  // Auth UI State
  loginForm: {                         // Login form draft
    username: string;
    password: string;
    rememberMe: boolean;
  };
  registerForm: {                      // Registration form draft
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  
  // Auth Flow State
  isLoggingIn: boolean;                // Login in progress
  isRegistering: boolean;              // Registration in progress
  authError: string | null;             // Last auth error message
}
```

**Actions:**
- `setToken(token, expiry)` - Set JWT token
- `clearToken()` - Clear token (logout)
- `setLoginForm(data)` - Update login form draft
- `setRegisterForm(data)` - Update register form draft
- `setAuthError(error)` - Set authentication error
- `clearAuthError()` - Clear authentication error

**Note:** User profile data (username, email, stats) should come from TanStack Query, not Redux.

---

## TanStack Query (Server State)

### Query Keys Structure

Use hierarchical query keys for better cache management:

```typescript
// Query Key Factory Pattern
export const queryKeys = {
  // User Queries
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    me: () => ['users', 'me'] as const,
    stats: (id: string) => ['users', id, 'stats'] as const,
    games: (id: string, filters?: GameFilters) => 
      ['users', id, 'games', filters] as const,
  },
  
  // Table Queries
  tables: {
    all: (filters?: TableFilters) => ['tables', filters] as const,
    detail: (id: string) => ['tables', id] as const,
    players: (id: string) => ['tables', id, 'players'] as const,
  },
  
  // Game Queries
  games: {
    all: (filters?: GameFilters) => ['games', filters] as const,
    detail: (id: string) => ['games', id] as const,
    history: (sessionId: string) => ['games', 'session', sessionId] as const,
  },
  
  // Bot Queries
  bots: {
    all: () => ['bots'] as const,
    detail: (id: string) => ['bots', id] as const,
    myBots: () => ['bots', 'my'] as const,
  },
  
  // Session Queries
  sessions: {
    all: (filters?: SessionFilters) => ['sessions', filters] as const,
    detail: (id: string) => ['sessions', id] as const,
    summary: (id: string) => ['sessions', id, 'summary'] as const,
  },
};
```

---

### 1. User Queries

**Query: Current User (`useCurrentUser`)**
```typescript
// GET /api/auth/me
useQuery({
  queryKey: queryKeys.users.me(),
  queryFn: () => api.getCurrentUser(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!token, // Only fetch if authenticated
});
```

**Data Stored:**
- User profile (id, username, email, avatar)
- User role (admin, user)
- Account creation date
- **NOT** stored in Redux (server data)

**Query: User Statistics (`useUserStats`)**
```typescript
// GET /api/users/:id/stats
useQuery({
  queryKey: queryKeys.users.stats(userId),
  queryFn: () => api.getUserStats(userId),
  staleTime: 2 * 60 * 1000, // 2 minutes
});
```

**Data Stored:**
- Games played count
- Games won count
- Win rate
- Total points
- Best score
- Average score

**Query: User Game History (`useUserGames`)**
```typescript
// GET /api/users/:id/games?page=1&limit=10
useInfiniteQuery({
  queryKey: queryKeys.users.games(userId, filters),
  queryFn: ({ pageParam = 1 }) => 
    api.getUserGames(userId, { page: pageParam, ...filters }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  staleTime: 1 * 60 * 1000, // 1 minute
});
```

**Data Stored:**
- List of games (paginated)
- Game details (id, date, result, points)
- Filters applied

---

### 2. Table Queries

**Query: Table List (`useTables`)**
```typescript
// GET /api/tables?page=1&limit=20&status=waiting
useInfiniteQuery({
  queryKey: queryKeys.tables.all(filters),
  queryFn: ({ pageParam = 1 }) => 
    api.getTables({ page: pageParam, ...filters }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  staleTime: 30 * 1000, // 30 seconds (frequently changing)
  refetchInterval: 10 * 1000, // Refetch every 10 seconds
});
```

**Data Stored:**
- List of tables (paginated)
- Table details (id, name, status, player count, host)
- Filters and pagination state

**Query: Table Detail (`useTable`)**
```typescript
// GET /api/tables/:id
useQuery({
  queryKey: queryKeys.tables.detail(tableId),
  queryFn: () => api.getTable(tableId),
  staleTime: 10 * 1000, // 10 seconds
  enabled: !!tableId,
});
```

**Data Stored:**
- Table configuration
- Table status (waiting, in_progress, completed)
- Game mode
- Session length
- Created/started timestamps

**Query: Table Players (`useTablePlayers`)**
```typescript
// GET /api/tables/:id/players
useQuery({
  queryKey: queryKeys.tables.players(tableId),
  queryFn: () => api.getTablePlayers(tableId),
  staleTime: 5 * 1000, // 5 seconds (players can join/leave)
  refetchInterval: 5 * 1000, // Refetch every 5 seconds
  enabled: !!tableId,
});
```

**Data Stored:**
- List of players in table
- Player positions
- Ready status
- Bot assignments

---

### 3. Game Queries

**Query: Game Detail (`useGame`)**
```typescript
// GET /api/games/:id
useQuery({
  queryKey: queryKeys.games.detail(gameId),
  queryFn: () => api.getGame(gameId),
  staleTime: 1 * 60 * 1000, // 1 minute
  enabled: !!gameId,
});
```

**Data Stored:**
- Game state (from server snapshot)
- Game log
- Scores
- Round information
- **Note:** Active game state comes from WebSocket, this is for completed games

**Query: Game History (`useGameHistory`)**
```typescript
// GET /api/sessions/:sessionId/games
useQuery({
  queryKey: queryKeys.games.history(sessionId),
  queryFn: () => api.getSessionGames(sessionId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Data Stored:**
- List of games in session
- Game results
- Scores per game

---

### 4. Bot Queries

**Query: My Bots (`useMyBots`)**
```typescript
// GET /api/bots
useQuery({
  queryKey: queryKeys.bots.myBots(),
  queryFn: () => api.getMyBots(),
  staleTime: 2 * 60 * 1000, // 2 minutes
});
```

**Data Stored:**
- List of user's bots
- Bot details (id, name, description, code, timestamps)

**Query: Bot Detail (`useBot`)**
```typescript
// GET /api/bots/:id
useQuery({
  queryKey: queryKeys.bots.detail(botId),
  queryFn: () => api.getBot(botId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!botId,
});
```

**Data Stored:**
- Bot code
- Bot metadata
- Bot statistics (if available)

---

### 5. Session Queries

**Query: Session Detail (`useSession`)**
```typescript
// GET /api/sessions/:id
useQuery({
  queryKey: queryKeys.sessions.detail(sessionId),
  queryFn: () => api.getSession(sessionId),
  staleTime: 1 * 60 * 1000, // 1 minute
});
```

**Data Stored:**
- Session configuration
- Session status
- Current game number
- Total games

**Query: Session Summary (`useSessionSummary`)**
```typescript
// GET /api/sessions/:id/summary
useQuery({
  queryKey: queryKeys.sessions.summary(sessionId),
  queryFn: () => api.getSessionSummary(sessionId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Data Stored:**
- Final rankings
- Total points per player
- Session winner
- Game-by-game breakdown

---

## Mutations (TanStack Query)

### User Mutations

**Update Profile (`useUpdateProfile`)**
```typescript
useMutation({
  mutationFn: (data: UpdateProfileData) => api.updateProfile(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
  },
});
```

**Change Password (`useChangePassword`)**
```typescript
useMutation({
  mutationFn: (data: ChangePasswordData) => api.changePassword(data),
  onSuccess: () => {
    // Show success notification (via Redux)
  },
});
```

### Table Mutations

**Create Table (`useCreateTable`)**
```typescript
useMutation({
  mutationFn: (data: CreateTableData) => api.createTable(data),
  onSuccess: (table) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.all() });
    // Navigate to table lobby
    navigate(`/table/${table.id}`);
  },
});
```

**Join Table (`useJoinTable`)**
```typescript
useMutation({
  mutationFn: (tableId: string) => api.joinTable(tableId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(tableId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.players(tableId) });
  },
});
```

**Leave Table (`useLeaveTable`)**
```typescript
useMutation({
  mutationFn: (tableId: string) => api.leaveTable(tableId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(tableId) });
    // Clear current table from Redux
    dispatch(setCurrentTable(null));
  },
});
```

### Bot Mutations

**Create Bot (`useCreateBot`)**
```typescript
useMutation({
  mutationFn: (data: CreateBotData) => api.createBot(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
  },
});
```

**Update Bot (`useUpdateBot`)**
```typescript
useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateBotData }) => 
    api.updateBot(id, data),
  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
    queryClient.invalidateQueries({ queryKey: queryKeys.bots.detail(variables.id) });
  },
});
```

**Delete Bot (`useDeleteBot`)**
```typescript
useMutation({
  mutationFn: (id: string) => api.deleteBot(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
  },
});
```

---

## WebSocket State Management

**Real-time game state** comes through WebSocket, not REST API:

1. **WebSocket Events** update TanStack Query cache directly:
   - `table_updated` → Invalidate `queryKeys.tables.detail(tableId)`
   - `player_joined` → Invalidate `queryKeys.tables.players(tableId)`
   - `game_state_update` → Update game state (optimistic update in Redux, then sync with server)

2. **Redux stores WebSocket connection state:**
   - `isConnected` - Connection status
   - `connectionError` - Last error

3. **Game state during active play:**
   - Real-time updates via WebSocket → Update Redux `gameSlice` for immediate UI
   - Periodic sync with server → Update TanStack Query cache for persistence

---

## State Synchronization Strategy

### When to Use Each:

| Data Type | Store | Reason |
|-----------|-------|--------|
| Selected cards in hand | Redux | UI-only, temporary |
| Table list from API | TanStack Query | Server data, cacheable |
| Modal open/closed | Redux | UI state |
| User profile from API | TanStack Query | Server data |
| JWT token | Redux + localStorage | Auth state, needs persistence |
| Turn timer countdown | Redux | UI animation state |
| Game state (active game) | Redux (from WebSocket) | Real-time, ephemeral |
| Completed game data | TanStack Query | Server data, cacheable |
| Form drafts (unsaved) | Redux | Temporary UI state |
| Bot code from API | TanStack Query | Server data |
| Theme preference | Redux | User preference, client-only |

---

## Best Practices

### Redux (UI State)
- ✅ Keep slices focused and small
- ✅ Use for ephemeral, UI-only state
- ✅ Persist only critical UI state (theme, preferences) to localStorage
- ✅ Don't duplicate server data in Redux

### TanStack Query (Server State)
- ✅ Use query keys consistently (use factory pattern)
- ✅ Set appropriate `staleTime` based on data volatility
- ✅ Use `refetchInterval` for frequently changing data (table list)
- ✅ Invalidate related queries on mutations
- ✅ Use `useInfiniteQuery` for paginated data
- ✅ Handle loading and error states properly

### Data Flow Example: Joining a Table

1. **User Action:** Tap "Join Table" button
2. **Redux:** Set `isJoining: true` (UI loading state)
3. **TanStack Query Mutation:** Call `useJoinTable` mutation
4. **API Call:** POST `/api/tables/:id/join`
5. **On Success:**
   - Invalidate table queries (refetch updated data)
   - Redux: Set `currentTableId` (UI context)
   - Redux: Clear `isJoining` (UI loading state)
   - Navigate to table lobby
6. **WebSocket:** Connect to table room, receive real-time updates

---

## Local State (Component State)

Use React `useState` for:
- Form inputs (before saving to Redux draft or submitting)
- Temporary UI state (hover, focus, temporary selections)
- Component-specific animations
- Local calculations/derived state
- Temporary UI interactions that don't need global access

**Examples:**
- Input field value (before form submission)
- Dropdown open/closed (if only used in one component)
- Temporary card selection (before committing to Redux)
- Local search/filter input

---

## Key User Interactions

### Touch Gestures
- **Tap:** Primary action (select, navigate)
- **Long Press:** Secondary action (context menu)
- **Swipe:** Navigation (pagination, back)
- **Pinch:** Zoom (if applicable)

### Loading States
- Skeleton screens for table list
- Loading spinners for actions
- Progress indicators for game state

### Error Handling
- Toast notifications for errors
- Inline validation for forms
- Retry buttons for failed requests

---

## Accessibility Considerations

- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators

---

## Future Enhancements

### Planned Features
- **Landing Page** (`/`)
  - Marketing/onboarding entry point
  - Game introduction and rules overview
  - Feature highlights and screenshots
  - Call-to-action buttons
  - Navigation to login/register or table list
  - Once implemented, will replace current redirect from root to `/tables`

### Additional Features
- Push notifications for turn alerts
- Offline mode support
- Game replay viewer
- Tournament mode
- Leaderboards
- Social features (friends, chat)

---

*This document should be updated as the application evolves and new features are added.*

