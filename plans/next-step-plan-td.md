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

