'use client'
import React, { useEffect,useState } from 'react'
import './topbar.css'
import { NotificationsNone, Language, Settings } from '@mui/icons-material'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { listAllDevis } from '../../../../redux/actions/devisActions' // ajuste le chemin si besoin

function Topbar() {
  const dispatch = useDispatch()
const [recentCount, setRecentCount] = useState(0)
  // 📦 Récupère tous les devis pour l'admin
  const devisAdminList = useSelector((state) => state.devisAdminList)
  const { loading, error, devis = [] } = devisAdminList || {}

  // 🔄 Charger les devis à chaque affichage
  useEffect(() => {
    dispatch(listAllDevis())
  }, [dispatch])
  useEffect(() => {
  if (devis && devis.length > 0) {
    const nonVus = devis.filter((d) => d.vu === false).length
    setRecentCount(nonVus)
  }
}, [devis])

  // 🟡 Compter les devis non vus
  const nonVusCount = devis.filter((d) => d.vu === false).length

  return (
    <div className="bg-black/60 topbar">
      <div className="topbarWrapper">
        <div className="topRight">
          <div className="topbarIconsContainer">
            <NotificationsNone />
            {nonVusCount > 0 && (
              <span className="topIconBadge">{nonVusCount}</span>
            )}
          </div>
          <div className="topbarIconsContainer">
            <Language />
            <span className="topIconBadge">1</span>
          </div>
          <div className="topbarIconsContainer">
            <Settings />
          </div>
          <div className="topAvatar">
            <Image
              src="/rahma.PNG"
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar


