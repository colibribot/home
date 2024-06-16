<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "alex1061.business@gmail.com";
    $subject = $_POST["subject"];
    $email = $_POST["email"];
    $issue_type = $_POST["issue-type"];
    $description = $_POST["description"];

    $message = "
    <html>
    <head>
    <title>Support Request</title>
    </head>
    <body>
    <h2>Support Request</h2>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Issue Type:</strong> {$issue_type}</p>
    <p><strong>Subject:</strong> {$subject}</p>
    <p><strong>Description:</strong> {$description}</p>
    </body>
    </html>
    ";

    // Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: {$email}" . "\r\n";

    // Attachments
    $attachments = $_FILES['attachments'];
    if (!empty($attachments['name'][0])) {
        $boundary = md5(time());
        $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";

        $message = "--{$boundary}\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $message .= "<html><body>{$message}</body></html>\r\n";
        
        foreach ($attachments['tmp_name'] as $key => $tmp_name) {
            $file_name = $attachments['name'][$key];
            $file_size = $attachments['size'][$key];
            $file_type = $attachments['type'][$key];
            $file_content = file_get_contents($tmp_name);
            $file_content = chunk_split(base64_encode($file_content));

            $message .= "--{$boundary}\r\n";
            $message .= "Content-Type: {$file_type}; name=\"{$file_name}\"\r\n";
            $message .= "Content-Transfer-Encoding: base64\r\n";
            $message .= "Content-Disposition: attachment; filename=\"{$file_name}\"\r\n\r\n";
            $message .= "{$file_content}\r\n\r\n";
        }

        $message .= "--{$boundary}--";
    }

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request method.";
}
?>
