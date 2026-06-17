# Plan for Improving the Overall Performance of the System

## Notes
- `border border-gray-200 dark:border-gray-700 rounded-md p-4` - to add borders(card) type to the component
- 
- 
- 
- 


-------------------------------------------------
## Bugs

- [x] When i am in `admin/profile` page the profile should be highlighted from the admin sidebar. 
- [x] Use gid layout and allign all(title, grids, etc) to the center in admin/profile 
- [x] In `admin/messages` add a lazy loader for the table.
- [x] In `admin/messages` allign all to the center. (Attach a screenshot)

- [] Fix the function bug:
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

- [] Enhance the loader and use skeletal loader when clicked on `Create New Room` or `Join` or when loading the room from room id and URL etc.

- []
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

