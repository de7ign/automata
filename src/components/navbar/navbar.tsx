import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AutomataNavbar() {
  return (
    <div className="flex w-auto h-16 justify-center items-center px-10 border-b">
      <div className="flex justify-between w-11/12">
        <div className="flex gap-2 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Automata Playground
            </span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary">Public Alpha v{process.env.npm_package_version}</Badge>
              </TooltipTrigger>
              <TooltipContent asChild>
                <div className='w-60'>
                  <Button variant='link' asChild className={cn('p-0')}>
                    <Link target='_blank' href='https://en.wikipedia.org/wiki/Software_release_life_cycle#Alpha'>
                    Alpha&nbsp;<ExternalLink size='18' /></Link> 
                  </Button>
                  &nbsp;Features are not tested thoroughly, and potentially unstable. UI/UX will change without notice.
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-4">
          {/* <Button variant="ghost">Feedback</Button> */}
          <Button variant="ghost" size="icon">
            <a href="https://github.com/de7ign" target='_blank'>
              <Icons.gitHub className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <a href="https://x.com/dzndev" target='_blank'>
              <Icons.twitter className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
