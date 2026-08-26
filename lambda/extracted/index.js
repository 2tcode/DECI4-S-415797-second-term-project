const NOTIFICATIONS_URL = "http://host.docker.internal:59449/notify";

exports.handler = async (event) => {
    console.log("Notification Lambda executed!");
    console.log("Event:", JSON.stringify(event));

    const records = event.Records || [];

    for (const record of records) {
        const bucket = record.s3?.bucket?.name;
        const key = record.s3?.object?.key;

        console.log(`S3 object created: ${bucket}/${key}`);

        try {
            const response = await fetch(NOTIFICATIONS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Ticket receipt created: ${key}`,
                    userId: null
                })
            });

            console.log("Notification service response:", await response.text());
        } catch (error) {
            console.error("Failed to notify Notifications service:", error);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Notification processed successfully",
            recordsProcessed: records.length
        })
    };
};