export default function Footer() {
  return (
    <footer className="bg-black border-t-2 border-yellow-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-400 text-black font-black text-sm flex items-center justify-center rounded">
              J
            </span>
            <span className="text-yellow-400 font-bold">Jadara To-Do List</span>
          </div>

          <p className="text-yellow-100/60 text-sm text-center">
            Stay organized. Get things done. Manage your tasks with ease.
          </p>

          <div className="flex items-center gap-4 text-sm text-yellow-100/60">
            <span>© {new Date().getFullYear()} Jadara</span>
          </div>
        </div>
      </div>
    </footer>
  );
}