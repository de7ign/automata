import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'

export default function AutomataNavbar() {
  return (
    <div className="flex w-auto h-16 justify-center items-center px-10 border-b">
      <div className="flex justify-between w-11/12">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Automata
          </span>
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost">Feedback</Button>
          <Button variant="ghost" size="icon">
            <Icons.gitHub className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icons.twitter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
