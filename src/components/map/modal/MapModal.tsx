import {createAnimation, IonButton, IonModal} from "@ionic/react";
import React, {useState} from "react";
import {MyMap} from "../MyMap";


export interface ModalProps {
    latitude: number;
    longitude: number;
}

export const MapModal: React.FC<ModalProps> = ({latitude, longitude}) => {
    const [showModal, setShowModal] = useState(false);

    const enterAnimation = (baseEl: any) => {
        console.log("Enter animation");
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.5', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(5)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }
    return (
        <>
            <IonModal isOpen={showModal} onAnimationStart={enterAnimation}  onAnimationEnd = {leaveAnimation}>
                <p>Modal content</p>
                <MyMap
                    lat={latitude}
                    lng={longitude}
                />
                <IonButton onClick={() => setShowModal(false)}>Close Map</IonButton>
            </IonModal>
            <IonButton onClick={() =>{
                console.log("Showing modal");
             setShowModal(true)}
            }>Show Map For Item</IonButton>
        </>
    );
};