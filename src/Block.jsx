import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import useGame from './stores/useGame'
import { useFrame, useThree } from '@react-three/fiber'

export default function Block({ finished = false, onVisited = null, position = [ 0, 0, 0 ] })
{
    const playerPosition = useGame(state => state.playerPosition)
    const [ visited, setVisited ] = useState(false)
    const material = useRef()
    const settings = useControls('blocks', {
        toVisiteColor: { value: '#db8d65' },
        toVisiteIntensity: { value: 4.5, min: 0, max: 20, step: 0.1 },
        visitedColor: { value: '#6b65db' },
        visitedIntensity: { value: 10, min: 0, max: 20, step: 0.1 },
        finishedColor: { value: '#c3ff87' },
        finishedIntensity: { value: 2.4, min: 0, max: 20, step: 0.1 }
    })

    useEffect(() =>
    {
        let color = settings.toVisiteColor

        if(finished)
            color = settings.finishedColor
        else if(visited)
            color = settings.visitedColor
            
        let intensity = settings.toVisiteIntensity

        if(finished)
            intensity = settings.finishedIntensity
        else if(visited)
            intensity = settings.visitedIntensity

        material.current.color.set(color)
        material.current.color.multiplyScalar(intensity)
    }, [ finished, visited, settings ])

    useFrame(() =>
    {
        const flatDistance = Math.hypot(playerPosition.x - position[0], playerPosition.z - position[2])
        
        if(flatDistance < 1)
        {
            const upDistance = playerPosition.y - position[1]
            
            if(upDistance > 0 && upDistance < 1.5)
            {
                if(!visited)
                {
                    onVisited()
                    setVisited(true)
                }
            }
        }
    })

    return <>
    
        <mesh position={ position }>
            <boxGeometry args={ [ 1, 0.1, 1 ] } />
            <meshBasicMaterial ref={ material } toneMapped={ false } />
        </mesh>

    </>
}