import "./App.css";
import FormBuilder from "./pages/FormBuilder";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
        </div>
      </header>
      <main className="py-6">
        <FormBuilder />
      </main>
    </div>
  );
}

export default App;
