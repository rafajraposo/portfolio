<?php

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = strip_tags(trim($_POST["name"]));
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim(str_replace("\n", "<br />", $_POST["message"]));

        if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "Oops! Please complete the form and try again.";
            exit;
        }
        
        $from = "contato@rafajraposo.com";
        $to = "rafajraposo@gmail.com";
        $subject = "Contato via Portfolio: {$name} - {$email}";

        $content = "<b>Name:</b> {$name}<br/><br/>";
        $content .= "<b>Email:</b> {$email}<br/><br/>";
        $content .= "<b>Message:</b><br/>{$message}";

        $headers   = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-type: text/html; charset=utf-8";
        $headers[] = "From: Contato <{$from}>";
        $headers[] = "Reply-To: Contato <{$from}>";
        $headers[] = "Subject: {$subject}";
        $headers[] = "X-Mailer: PHP/".phpversion();

        $sent = mail ($to, $subject, $content, implode("\r\n", $headers));

        if ($sent) {
            http_response_code(200);
            echo "Your message has been sent, I'll reply ASAP!";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>