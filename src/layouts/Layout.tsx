import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  variant?: 'primary' | 'white'
  activeStep?: 1 | 2 | 3 | 4
  hideFooter?: boolean
  headerExtra?: React.ReactNode
}

const Layout = ({ children, variant, activeStep, hideFooter, headerExtra }: LayoutProps) => {
  return (
    <div className={`flex flex-col ${hideFooter ? 'h-screen overflow-hidden' : 'min-h-screen bg-background'}`}>
      <Header variant={variant} activeStep={activeStep} headerExtra={headerExtra} />
      <main className={`flex-1 relative flex flex-col ${hideFooter ? 'overflow-hidden' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
