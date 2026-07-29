export async function sendNotification({

    channel,

    recipient,

    subject,

    message,

}:{

    channel:
        |"email"
        |"sms"
        |"whatsapp"
        |"push";

    recipient:string;

    subject?:string;

    message:string;

}){

    switch(channel){

        case "email":

            return sendEmail(...);

        case "sms":

            return sendSMS(...);

        case "whatsapp":

            return sendWhatsapp(...);

        case "push":

            return sendPush(...);

    }

}
