import Navbar from '@/components/layouts/Navbar'
import Sidebar from '@/components/layouts/Sidebar'
export default function HomePage() {
  return (

    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          Hello Big Five Project
        </div>
      </div>

    </div>
  );
}