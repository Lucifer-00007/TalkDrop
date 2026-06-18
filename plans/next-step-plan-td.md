# Plan for Improving the Overall Performance of the System

## Notes
- `border border-gray-200 dark:border-gray-700 rounded-md p-4` - to add borders(card) type to the component
- `npm run admin:claims -- grant your-email@gmail.com`
- 
- 
- 


-------------------------------------------------
## Bugs

- [x] When i am in `admin/profile` page the profile should be highlighted from the admin sidebar. 
- [x] Use gid layout and allign all(title, grids, etc) to the center in admin/profile 
- [x] In `admin/messages` add a lazy loader for the table.
- [x] In `admin/messages` allign all to the center. (Attach a screenshot)

- [x] Fix the function bug:
	```
	✔ Do you want to install dependencies with npm now? Yes

	up to date, audited 423 packages in 40s

	60 packages are looking for funding
	  run `npm fund` for details

	11 vulnerabilities (10 moderate, 1 critical)

	To address issues that do not require attention, run:
	  npm audit fix

	To address all issues, run:
	  npm audit fix --force

	Run `npm audit` for details.

	✔  Wrote configuration info to firebase.json
	✔  Wrote project information to .firebaserc

	✔  Firebase initialization complete!
	```

- [x] Harden `/admin` properly next by implementing real admin authorization end to end.

	**What Is Missing / Weak**
		- `/admin` authorization is not enforced server-side at the route level. The route check is only in the client layout, so it is UI protection, not strong route protection: [AdminLayout](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/src/components/AdminLayout.tsx#L10-L34).
		- The shared auth hook treats any signed-in Firebase user as authenticated, including anonymous users from the public chat flow: [useAuth.ts](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/src/hooks/useAuth.ts#L41-L59).
		- That means a user who already signed in anonymously can satisfy `user != null`, and `AdminLayout` will show admin pages without forcing the admin login form.
		- Admin data reads are done directly from the client with Firebase SDKs in [admin-stats.ts](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/src/lib/admin-stats.ts#L13-L70), [admin.ts](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/src/lib/admin.ts#L11-L37), and [users/page.tsx](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/src/app/admin/users/page.tsx#L25-L61).
		- Firestore rules currently allow any authenticated user to read/list rooms and read/write messages in [firestore.rules](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/firestore.rules#L10-L17), and RTDB rules allow any authenticated user to read/write in [database.rules.json](file:///Users/ani/Developer/ANI/ProjectsOrgs/1VibeCodeAI/AntiGravity/TalkDrop/database.rules.json#L2-L9).

		**Bottom Line**
		- `Authentication exists`: admin login UI plus allowed-email validation.
		- `Authorization exists only partially`: some delete actions are protected by Firestore rules.
		- `Full admin protection does not exist`: admin pages and most admin reads are effectively accessible to any authenticated Firebase user, including anonymous users.

		**Best-Practice Recommendation**
		- Add real admin authorization using Firebase custom claims or a server-verified admin session.
		- Enforce admin access in route protection, not just client UI.
		- Tighten Firestore and RTDB rules so admin reads/writes require `isAdmin`, not just `auth != null`.

- [x] Based on the following remove add auth restriction to `create room`. Any anonymous user can create room in existing or new. Fix this following the best practices
	
	- The `admin security model` and `create room` user auth are both diff.
	- The `admin security model` should always follow the static-safe architecture. Refer the ./plans/admin-static-security-migration-plan.md
	- Also we are using - Next.js static pages, route guard for loading, redirect, and friendly access-denied UX and Firebase client SDK data fetching
	- We are not using any - Next.js API routes, Next.js middleware, server-side route protection, server sessions or cookies, private request-time backend logic in the deployed app
                                                                                                          
	```error-msg
   XHRPOST                                                                                                             
   https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCuH5aAQtDoppgbCB_p_HcKkhv5zVPETQc               
   [HTTP/3 400  481ms]                                                                                                 
                                                                                                                       
   Sign in failed: FirebaseError: Firebase: Error (auth/admin-restricted-operation).                                   
       NextJS 16                                                                                                       
   page-598b852560e1b5a1.js:1:1066                                                                                     
   Failed to create room: FirebaseError: Firebase: Error (auth/admin-restricted-operation).                            
       NextJS 16                                                                                                       
   page-598b852560e1b5a1.js:1:6605    .There are some points to be noted:
   ```

- [x] Fix these issue 

	- When clicked on url like `http://localhost:3000/room?roomid=yiuj9o` prompt him/her to only enter the unique name and join the chat room with the room-id `yiuj9o`

	- When a user is trying to join an existing room using `Room ID`  or like the above link then first check if the room id already exists or if already created or not expired or if there is no user in the room, etc - if any of these issue exist then show this a proper error message, else take the unique name and allow him to join.

- [x] The existing room - `General Chat`, `Random`, `Tech Talk`, `Gaming` and `Music Lover` should never expire. This only apply to these 5 rooms only.

- [x] Refer the attached image. In mobile view. Fix there following UI issue inside a room: 
	- In the header i want the count of no. of user joined. 
	- Decrease the size of the message `Share the room ID to invite others`
	- When clicked on the `user icon` i want a list of all the joined users 

- [x] Enhance the loader and use skeletal loader when clicked on `Create New Room` or `Join` or when loading the room from room id and URL etc.

- [x] Create a script inside the ./scripts/ directory that checks all files under ./src and reports any file that exceeds 500 lines.

	Requirements:
		- Ignore the ./src/components/ui/ directory completely.
		- Scan only source files inside ./src.
		- If one or more files exceed 500 lines, output a list of those files with their line counts.
		- At the end of the report, include a short recommendation suggesting that large files should be split into smaller modules.

	Refactoring guidance for the recommendation:
		- For example, if a file is named userListing, suggest creating a folder named userListing.
		- Move the related modular pieces into that folder.
		- Add an index file for clean exports.
		- Delete the original userListing file after the refactor.
		- Update all imports that referenced the old file so they point to the new module structure.

	Additional expectations:
		- Write clean, maintainable code.
		- Follow best practices.
		- Include comments where helpful.
		- Make the script easy to run and understand.
		- Ensure the output is clear and actionable.

- [x] Review the ./src/ codebase and identify files, modules, or components that appear to be stale, outdated, unused, or safe to remove.

	Requirements:
		- Inspect the source tree under ./src/ thoroughly.
		- Detect files that are no longer referenced anywhere in the codebase.
		- Flag code that appears deprecated, duplicated, dead, or clearly superseded by newer implementations.
		- Do not mark something as removable unless there is reasonable evidence that it is unused or obsolete.
		- Exclude false positives caused by dynamic imports, route-based usage, runtime reflection, or generated code.
		- For each candidate, provide:
		  - file path
		  - reason it appears unused or outdated
		  - any references found, or note that none were found
		  - a confidence level: high / medium / low
		- Group findings by confidence and priority.
		- Clearly separate “safe to remove” candidates from “needs manual review”.
		- If there are no obvious candidates, say so explicitly.

	Output format:
		1. Summary
		2. Safe to remove
		3. Needs manual review
		4. Notes on why each item was flagged

	Make the analysis practical, conservative, and focused on minimizing the risk of deleting active code.

- [x] ./md-docs/DEAD_CODE_ANALYSIS.md - Remove all the 5 Safe to remove and 3 Needs manual review. Only keep this - "### 1. `signUpWithEmail` and `getCurrentUser` in `src/lib/auth.ts`" as it will be used in the admin section.

- [x] Do i need to run `npm run admin:claims -- grant <email>` if the gmail is added in authentication/users in firebase ?

	- Yes, you need to run the grant command — adding a user in Firebase Console → Authentication → Users only creates the auth account. 

	The isAdmin: true custom claim is separate metadata that can only be set via the Firebase Admin SDK, which is what npm run admin:claims -- grant <email> does. There's no way to set custom claims from the Firebase Console UI.

	The script was broken due to firebase-admin v14 API changes (admin.apps → admin.getApps(), admin.credential.cert() → admin.cert(), app.auth() → getAuth(app)), so even if you ran it before, it never actually worked. I fixed all three breaks and added a list action so you can verify claims anytime.

- [] Build an admin management page at /admin/rooms to manage all chat rooms in the application.

	Requirements:
		- Show a paginated list of all created chat rooms.
		- Support CRUD operations for rooms:
		  - View room details
		  - Update room information
		  - Delete room
		- Display key room metrics and metadata, including:
		  - Room name / title
		  - Room ID
		  - Last message date/time
		  - Number of users joined
		  - List of joined users
		  - Number of messages
		  - Room status (active / disabled)
		- Add search and filtering features to help admins find rooms easily.
		  - Search by room name, room ID, or user name
		  - Filter by status, date range, and user count/message count where applicable
		- Add enable/disable functionality for rooms.
		  - When a room is disabled, it must be hidden from normal users
		  - Disabled rooms must not allow any users to join. Old or New.
		  - Existing data should remain intact unless the room is deleted
		- Follow best practices for:
		  - Clean, maintainable, and scalable code
		  - Proper separation of concerns
		  - Reusable components
		  - Secure admin-only access control
		  - Validation and error handling
		  - Good UX for loading, empty, and error states

	Implementation expectations:
		- Use the existing project architecture and follow current codebase conventions.
		- Create all necessary frontend changes.
		- Include any required UI components.
		- Make the UI responsive and admin-friendly.
		- Add comments only where they improve clarity.

	Deliver a complete implementation with production-quality code.

- [] Enhance the UI UX of all the admin pages - dashboard, users, messages, settings and profile.

- []
- []


## Mobile View
- []
- []
- []


-------------------------------------------------
## New features

- [x] Add a `profile` section in the admin to manage the logged in used.
- [] Create the `dynamic room routing` firebase func(in `firebase-micro-services`) and use it in `TalkDrop` project.
- [] Complete & Test the create room id using the Firebase Functions Setup for Dynamic Room Routing. And fix if any bug found.
- []


-------------------------------------------------
## To be done Manually

- []
- []
- []

