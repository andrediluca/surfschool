import LessonList from "./components/LessonList";
import SurfboardList from "./components/SurfboardList";
import Conditions from "./components/Conditions";
import BoardRentalForm from "./components/BoardRentalForm";




function App() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mt-6">🏄 Surf School Webapp</h1>
      <LessonList />
      <SurfboardList/>
      <Conditions/>
      <BoardRentalForm/>
    </div>
  );
}

export default App;
