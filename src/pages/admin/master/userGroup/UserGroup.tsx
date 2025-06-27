
const UserGroupIframe = () => {
  // You can get the token from context, redux, or props as needed
// const token = localStorage.getItem("spree_api_key"); // or however you store it
  const token = ""
  // Choose the domain based on window.location.host
  const host = window.location.host;
  const domain = host.includes("newerp.marathonrealty")
    ? "testui.lockated.com"
    : "ui.lockated.com";

  return (
    <iframe
      src={`https://ui.lockated.com/user-group?token=${token}`}
      style={{ width: "100%", height: "1000px", border: "none" }}
      title="User Group"
    />
  );
};

export default UserGroupIframe;