import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Hero from '@/components/Landing/Hero'
import DashboardMockup from '@/components/Landing/DashboardMockup'
import Problems from '@/components/Landing/Problems'
import CTA from '@/components/Landing/CTA'

export default function Home() {
  return (
    <>
      <NavBar />
      <main className='min-h-screen bg-[#F9FAFB] text-[#111827] transition-all dark:bg-[#0F172A] dark:text-[#F9FAFB] mt-16'>
        <section  className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <Hero />
          <DashboardMockup />
        </section>
        <Problems />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
