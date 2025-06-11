import signOutAction from "~/actions/cred";

export default function SignOutBtn() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="w-full text-left">
        Sign Out
      </button>
    </form>
  );
}
