import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Menu } from 'lucide-react'

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
          <a href="#top" className="flex items-center gap-2 pr-2">
            <span className="text-lg font-bold tracking-tight text-[#E0AAFF]">JobSheets</span>
          </a>

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
                onClick={onGetStarted}
                className="rounded-full px-3 text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF]"
              >
                Log In
              </Button>
              <Button
                type="button"
                onClick={onGetStarted}
                className="rounded-full bg-[#7B2CBF] px-4 text-[#E0AAFF] hover:bg-[#9D4EDD]"
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
              onClick={onGetStarted}
              className="rounded-full px-3 text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF]"
            >
              Log In
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF]"
                >
                  <Menu className="size-5" />
                </Button>
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
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="text-left text-base font-medium text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
                  >
                    Log In
                  </button>
                </div>

                <div className="mt-auto">
                  <Button
                    type="button"
                    onClick={onGetStarted}
                    className="w-full rounded-full bg-[#7B2CBF] text-[#E0AAFF] hover:bg-[#9D4EDD]"
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
