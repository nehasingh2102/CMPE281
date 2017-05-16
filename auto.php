<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Untitled Document</title>
</head>

<body>

<?php

//require 'vendor/autoload.php';   AKIAJNPCKJBHFWAZMCCQ   eHomIXVVd77A972QR00XZDUVXgzE6Gkxm9TOE4H3

use Aws\Ec2\Ec2Client;

$ec2Client = Ec2Client::factory(array(
    'key'    => '[AKIAJ66IS7NMUSDSI2KQ]',
    'secret' => '[qFWqoYq66Xzy/O92X8GSQXfl8o4LrRrXD9JKu2TK]',
    'region' => '[us-west-2]' // (e.g., us-east-1)
));

	// Create the key pair
$keyPairName = 'my-keypair';
$result = $ec2Client->createKeyPair(array(
    'KeyName' => $keyPairName
));
	
	// Save the private key
$saveKeyLocation = getenv('HOME') . "/.ssh/{$keyPairName}.pem";
file_put_contents($saveKeyLocation, $result['keyMaterial']);

// Update the key's permissions so it can be used with SSH
chmod($saveKeyLocation, 0600);

	// Create the security group
$securityGroupName = 'my-security-group';
$result = $ec2Client->createSecurityGroup(array(
    'GroupName'   => $securityGroupName,
    'Description' => 'Basic web server security'
));

// Get the security group ID (optional)
$securityGroupId = $result->get('GroupId');
	
	// Set ingress rules for the security group
$ec2Client->authorizeSecurityGroupIngress(array(
    'GroupName'     => $securityGroupName,
    'IpPermissions' => array(
        array(
            'IpProtocol' => 'tcp',
            'FromPort'   => 80,
            'ToPort'     => 80,
            'IpRanges'   => array(
                array('CidrIp' => '0.0.0.0/0')
            ),
        ),
        array(
            'IpProtocol' => 'tcp',
            'FromPort'   => 22,
            'ToPort'     => 22,
            'IpRanges'   => array(
                array('CidrIp' => '0.0.0.0/0')
            ),
        )
    )
));
	
	// Launch an instance with the key pair and security group
$result = $ec2Client->runInstances(array(
    'ImageId'        => 'ami-7c22b41c',
    'MinCount'       => 1,
    'MaxCount'       => 1,
    'InstanceType'   => 't2.micro',
    'KeyName'        => $keyPairName,
    'SecurityGroups' => array($securityGroupName),
));
	
	$instanceIds = $result->getPath('Instances/*/InstanceId');
?>
</body>
</html>