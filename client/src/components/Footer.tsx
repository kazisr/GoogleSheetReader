export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            @ Made with love by Kazi 🖤
          </div>
          <div className="mt-4 md:mt-0">
            <a href="https://developers.google.com/sheets/api" className="text-sm text-primary hover:text-blue-700">API Documentation</a>
            <span className="mx-2 text-gray-300">|</span>
            <a href="#" className="text-sm text-primary hover:text-blue-700">Help</a>
            <span className="mx-2 text-gray-300">|</span>
            <a href="https://policies.google.com/privacy" className="text-sm text-primary hover:text-blue-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
