import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold">
          Welcome {user?.name}
        </h1>
      </div>
    </>
  );
};

export default Dashboard;