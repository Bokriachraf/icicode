'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  Dashboard,
  People,
  AssignmentTurnedIn,
  MenuBook,
  VideoCall,
  FitnessCenter,
  BarChart,
  Settings,
  School,
  AttachMoney,
} from '@mui/icons-material'
import './sidebar.css'

const NavItem = ({ href, icon, label, active }) => (
  <li className={`sidebarListItem ${active ? 'active' : ''}`}>
    <Link href={href} className="link flex items-center gap-2">
      <span className="sidebarIcon">{icon}</span>
      {label}
    </Link>
  </li>
)

export default function Sidebar() {
  const pathname = usePathname()
  const { userInfo } = useSelector((state) => state.userSignin || {})

  const isGeneralAdmin = userInfo?.isAdmin && userInfo?.role !== 'prof'
  const isProf = userInfo?.role === 'prof' || userInfo?.isAdmin

  const active = (path) => pathname === path || pathname.startsWith(path + '/')

  return (
    <div className="sidebar shadow-xl bg-black/60 backdrop-blur-md">
      <div className="sidebarwrapper">

        {/* ── Section commune ── */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Tableau de bord</h3>
          <ul className="sidebarList">
            <NavItem href="/admin" icon={<Dashboard />} label="Accueil" active={pathname === '/admin'} />
            {isGeneralAdmin && (
              <NavItem href="/admin/stats" icon={<BarChart />} label="Statistiques" active={active('/admin/stats')} />
            )}
          </ul>
        </div>

        {/* ── Admin Général uniquement ── */}
        {isGeneralAdmin && (
          <>
            <div className="sidebarMenu">
              <h3 className="sidebarTitle">Gestion</h3>
              <ul className="sidebarList">
                <NavItem href="/admin/inscription" icon={<AssignmentTurnedIn />} label="Inscriptions" active={active('/admin/inscription')} />
                <NavItem href="/admin/users" icon={<People />} label="Utilisateurs" active={active('/admin/users')} />
                <NavItem href="/admin/niveaux" icon={<School />} label="Niveaux" active={active('/admin/niveaux')} />
              </ul>
            </div>

            <div className="sidebarMenu">
              <h3 className="sidebarTitle">Facturation</h3>
              <ul className="sidebarList">
                <NavItem href="/admin/paiements" icon={<AttachMoney />} label="Paiements" active={active('/admin/paiements')} />
                <NavItem href="/admin/plans" icon={<AttachMoney />} label="Plans tarifaires" active={active('/admin/plans')} />
              </ul>
            </div>
          </>
        )}

        {/* ── Prof + Admin ── */}
        {isProf && (
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Contenu</h3>
            <ul className="sidebarList">
              <NavItem href="/admin/chapitres"   icon={<MenuBook />}   label="Chapitres"   active={active('/admin/chapitres')} />
              <NavItem href="/admin/seances"     icon={<VideoCall />}  label="Séances"     active={active('/admin/seances')} />
              <NavItem href="/admin/groupes"     icon={<People />}     label="Groupes"     active={active('/admin/groupes')} />
              <NavItem href="/admin/exercices"   icon={<FitnessCenter />} label="Exercices" active={active('/admin/exercices')} />
              <NavItem href="/admin/affectations" icon={<AssignmentTurnedIn />} label="Affectations" active={active('/admin/affectations')} />
              <NavItem href="/admin/corrections" icon={<AssignmentTurnedIn />} label="Corrections" active={active('/admin/corrections')} />
            </ul>
          </div>
        )}

        {isProf && (
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Suivi</h3>
            <ul className="sidebarList">
              <NavItem href="/admin/progression" icon={<BarChart />} label="Progressions" active={active('/admin/progression')} />
            </ul>
          </div>
        )}

        {/* ── Paramètres ── */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Paramètres</h3>
          <ul className="sidebarList">
            <li className="sidebarListItemlast">
              <Settings className="sidebarIcon" />
              Configuration
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
