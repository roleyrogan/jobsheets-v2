import { Button } from '@heroui/react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Menu } from 'lucide-react'
import { filledButtonClass, ghostButtonClass } from '@/lib/heroui-button'

type Navigation5Props = {
  onGetStarted?: () => void
}

export function Navigation5({ onGetStarted }: Navigation5Props) {
  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6">
        {/* Floating Navbar Pill */}
        <div className="flex h-14 w-full max-w-2xl items-center justify-between gap-2 rounded-full border border-[#3C096C] bg-[#240046]/85 px-3 shadow-lg backdrop-blur-md sm:h-16 sm:px-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-2 pr-2 text-lg font-bold tracking-tight text-[#E0AAFF] transition-colors hover:text-[#E0AAFF]/80"
          >
            JobSheets
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="rounded-full bg-transparent px-3 py-2 text-sm font-medium text-[#C77DFF] transition-colors hover:bg-[#3C096C]/60 hover:text-[#E0AAFF]"
                    href="#features"
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onPress={onGetStarted}
                className={`rounded-full ${ghostButtonClass}`}
              >
                Log In
              </Button>
              <Button
                type="button"
                onPress={onGetStarted}
                className={`rounded-full ${filledButtonClass}`}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-1 md:hidden">
            <Button
              type="button"
              variant="ghost"
              onPress={onGetStarted}
              className={`rounded-full ${ghostButtonClass}`}
            >
              Log In
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-9 items-center justify-center rounded-full text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF]"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[280px] flex-col gap-6 border-[#3C096C] bg-[#240046] p-6"
              >
                <span className="text-lg font-bold tracking-tight text-[#E0AAFF]">JobSheets</span>

                <div className="flex flex-col gap-4">
                  <a
                    href="#features"
                    className="text-base font-medium text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
                  >
                    Features
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    onPress={onGetStarted}
                    className={`justify-start px-0 ${ghostButtonClass}`}
                  >
                    Log In
                  </Button>
                </div>

                <div className="mt-auto">
                  <Button
                    type="button"
                    fullWidth
                    onPress={onGetStarted}
                    className={`rounded-full ${filledButtonClass}`}
                  >
                    Sign In
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}
