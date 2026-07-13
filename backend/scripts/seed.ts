import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User';
import Song from '../models/Song';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Playlist from '../models/Playlist';
import Like from '../models/Like';
import History from '../models/History';

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify_clone';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Song.deleteMany({}),
      Artist.deleteMany({}),
      Album.deleteMany({}),
      Playlist.deleteMany({}),
      Like.deleteMany({}),
      History.deleteMany({}),
    ]);
    console.log('Database cleared.');

    // 1. Create Users
    console.log('Creating seed users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const adminUser = await User.create({
      name: 'Spotify Admin',
      email: 'admin@spotify.com',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@spotify.com',
      password: userPassword,
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe',
    });
    console.log('Users created successfully.');

    // 2. Create Artists
    console.log('Creating artists...');
    const artistLofi = await Artist.create({
      name: 'Lofi Chill Records',
      bio: 'Relaxing lo-fi beats, cozy vibes and ambient melodies. The perfect background music for studying, reading, or relaxing.',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop&q=80',
      coverBanner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop&q=80',
      monthlyListeners: 1542000,
    });

    const artistSynth = await Artist.create({
      name: 'Neon Retro Vibe',
      bio: 'High-energy electronic beats, synthwave dreams and retro-futurism soundscapes. Taking you straight back to the 80s neon grid.',
      avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop&q=80',
      coverBanner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop&q=80',
      monthlyListeners: 824000,
    });

    const artistAcoustic = await Artist.create({
      name: 'Clara & The Strings',
      bio: 'Heartwarming acoustic strings, indie-folk tunes and soulful storytelling vocals. Simple, raw, and beautiful melodies.',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&q=80',
      coverBanner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop&q=80',
      monthlyListeners: 310000,
    });
    console.log('Artists created.');

    // 3. Create Albums
    console.log('Creating albums...');
    const albumChill = await Album.create({
      title: 'Midnight Cozy Café',
      artist: artistLofi._id,
      coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop&q=80',
      releaseDate: '2024',
      genre: 'Lofi',
      songs: [],
    });

    const albumSynthCity = await Album.create({
      title: 'Digital Sunset Drive',
      artist: artistSynth._id,
      coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop&q=80',
      releaseDate: '2023',
      genre: 'Synthwave',
      songs: [],
    });

    const albumCampfire = await Album.create({
      title: 'Campfire Sessions',
      artist: artistAcoustic._id,
      coverImage: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=400&h=400&fit=crop&q=80',
      releaseDate: '2025',
      genre: 'Indie Folk',
      songs: [],
    });
    console.log('Albums created.');

    // 4. Create Songs (SoundHelix public URL paths for test audio files)
    console.log('Creating songs...');
    const songsData = [
      {
        title: 'Summer Breeze Lullaby',
        artist: artistLofi._id,
        album: albumChill._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: albumChill.coverImage,
        duration: 372, // 6:12
        genre: 'Lofi',
        plays: 42350,
        isFeatured: true,
      },
      {
        title: 'Raindrops & Tea Cups',
        artist: artistLofi._id,
        album: albumChill._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&h=400&fit=crop&q=80',
        duration: 425, // 7:05
        genre: 'Lofi',
        plays: 12500,
        isFeatured: false,
      },
      {
        title: 'Study Session Focus',
        artist: artistLofi._id,
        album: albumChill._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: albumChill.coverImage,
        duration: 324, // 5:24
        genre: 'Lofi',
        plays: 98120,
        isFeatured: true,
      },
      {
        title: 'Retro-Wave Neon Grid',
        artist: artistSynth._id,
        album: albumSynthCity._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: albumSynthCity.coverImage,
        duration: 302, // 5:02
        genre: 'Synthwave',
        plays: 231500,
        isFeatured: true,
      },
      {
        title: 'Cyberpunk Skyline Walk',
        artist: artistSynth._id,
        album: albumSynthCity._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop&q=80',
        duration: 341, // 5:41
        genre: 'Synthwave',
        plays: 75200,
        isFeatured: false,
      },
      {
        title: 'Folk Whispers in the Wind',
        artist: artistAcoustic._id,
        album: albumCampfire._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        coverImage: albumCampfire.coverImage,
        duration: 362, // 6:02
        genre: 'Indie Folk',
        plays: 19400,
        isFeatured: true,
      },
      {
        title: 'Woodland Cabin Acoustic',
        artist: artistAcoustic._id,
        album: albumCampfire._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        coverImage: albumCampfire.coverImage,
        duration: 318, // 5:18
        genre: 'Indie Folk',
        plays: 4800,
        isFeatured: false,
      },
      {
        title: 'Sunset Spark Horizon',
        artist: artistSynth._id,
        album: albumSynthCity._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop&q=80',
        duration: 312, // 5:12
        genre: 'Synthwave',
        plays: 129000,
        isFeatured: true,
      },
    ];

    const songs = await Song.create(songsData);
    console.log('Songs created.');

    // 5. Update albums with created songs IDs
    console.log('Linking songs to albums...');
    for (const song of songs) {
      if (song.album) {
        await Album.findByIdAndUpdate(song.album, { $push: { songs: song._id } });
      }
    }
    console.log('Albums updated.');

    // 6. Create default public featured playlist
    console.log('Creating initial playlists...');
    const playlistLofiVibes = await Playlist.create({
      name: 'Lofi Focus Playlist',
      description: 'The best lo-fi beats curated by Spotify Admin to help you focus and study.',
      creator: adminUser._id,
      coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop&q=80',
      isPublic: true,
      songs: [songs[0]._id, songs[1]._id, songs[2]._id],
    });

    const playlistSynthSunset = await Playlist.create({
      name: 'Retro Outrun Midnight',
      description: 'Hop in your Testarossa and drive through the cyber grid under the sunset.',
      creator: adminUser._id,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80',
      isPublic: true,
      songs: [songs[3]._id, songs[4]._id, songs[7]._id],
    });

    // Add playlists to Admin's user profile
    await User.findByIdAndUpdate(adminUser._id, {
      $push: { playlists: { $each: [playlistLofiVibes._id, playlistSynthSunset._id] } },
    });
    console.log('Playlists created.');

    // 7. Create some likes and listening history for standardUser
    console.log('Creating dummy likes & history logs for John Doe user...');
    await Like.create({ user: standardUser._id, song: songs[0]._id });
    await Like.create({ user: standardUser._id, song: songs[3]._id });

    await History.create({ user: standardUser._id, song: songs[0]._id, playedAt: new Date(Date.now() - 3600000) });
    await History.create({ user: standardUser._id, song: songs[1]._id, playedAt: new Date(Date.now() - 1800000) });
    await History.create({ user: standardUser._id, song: songs[3]._id, playedAt: new Date() });

    console.log('----------------------------------------------------');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Admin User: email: admin@spotify.com | password: admin123`);
    console.log(`Standard User: email: user@spotify.com | password: user123`);
    console.log(`Seeded: ${songs.length} Songs, ${3} Artists, ${3} Albums, ${2} Playlists`);
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
