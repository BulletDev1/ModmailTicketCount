# Bot latency plugin for [Dragory's ModMail](https://github.com/dragory/modmailbot)

### Setup: ###
Make sure your running at least v3.0.3 of Modmail.
in your config.ini file, make a new line and add:  
```ini
plugins[] = npm:MMPlugins/Ping
```
Restart your bot!

And that's it!
Use [prefix]ping (by default, your prefix is !) and watch the magic!

This command also works in DMs - but it will create a thread channel.
