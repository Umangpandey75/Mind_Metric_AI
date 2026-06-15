import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AssessmentLibrary from './pages/AssessmentLibrary'
import AssessmentDetail from './pages/AssessmentDetail'
import AssessmentTaking from './pages/AssessmentTaking'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Results from './pages/Results'
import { PrivacyPolicy, TermsOfService, Disclaimer } from './pages/LegalPages'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-surfaceLight dark:bg-surfaceDark text-gray-900 dark:text-gray-100 font-sans">
        <Navbar />

        <main className="flex-1 pt-16">
          <Routes>
            {/* Core routes */}
            <Route path="/"                               element={<Home />} />
            <Route path="/assessments"                    element={<AssessmentLibrary />} />
            <Route path="/assessment/:id"                 element={<AssessmentDetail />} />
            <Route path="/assessment/:id/take"            element={<AssessmentTaking />} />
            <Route path="/results/:id"                    element={<Results />} />
            <Route path="/dashboard"                      element={<Dashboard />} />
            <Route path="/about"                          element={<About />} />

            {/* Legal pages */}
            <Route path="/privacy"                        element={<PrivacyPolicy />} />
            <Route path="/terms"                          element={<TermsOfService />} />
            <Route path="/disclaimer"                     element={<Disclaimer />} />

            {/* Canonical nested assessment routes */}
            <Route path="/assessments/:assessmentId"      element={<AssessmentDetail />} />
            <Route path="/assessments/:assessmentId/take" element={<AssessmentTaking />} />
            <Route path="/results/:assessmentId"          element={<Results />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-6">
                  <p className="text-8xl font-extrabold text-primary dark:text-primaryDark">404</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">Page not found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">The page you are looking for does not exist.</p>
                  <a href="/" className="mt-2 text-sm font-semibold text-primary dark:text-primaryDark hover:underline">← Back to Home</a>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
