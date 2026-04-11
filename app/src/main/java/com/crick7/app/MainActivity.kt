package com.crick7.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val Green = Color(0xFF1B5E20)
val LightGreen = Color(0xFF4CAF50)
val Accent = Color(0xFFFFC107)
val CardBg = Color(0xFFF5F5F5)
val TextDark = Color(0xFF1A1A1A)
val TextGray = Color(0xFF757575)

data class Match(
    val team1: String,
    val team2: String,
    val flag1: String,
    val flag2: String,
    val score1: String,
    val score2: String,
    val status: String,
    val isLive: Boolean
)

data class Player(
    val name: String,
    val role: String,
    val rating: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Crick7App()
        }
    }
}

@Composable
fun Crick7App() {
    val matches = listOf(
        Match("India", "Australia", "🇮🇳", "🇦🇺", "287/4 (42.0)", "156/3 (28.0)", "LIVE • 14 overs left", true),
        Match("England", "Pakistan", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇵🇰", "312/8 (50.0)", "289/10 (47.3)", "ENG won by 23 runs", false),
        Match("New Zealand", "South Africa", "🇳🇿", "🇿🇦", "198/6 (35.0)", "Yet to bat", "NZ Innings", false)
    )
    val players = listOf(
        Player("V. Kohli", "Batsman", "9.4"),
        Player("B. Bumrah", "Bowler", "9.1"),
        Player("S. Smith", "Batsman", "8.9"),
        Player("K. Rabada", "Bowler", "8.7"),
        Player("J. Root", "Batsman", "8.8")
    )

    MaterialTheme {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            item { TopBar() }
            item { FeaturedMatch(matches.first()) }
            item {
                SectionHeader("Live & Recent")
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(matches) { MatchCard(it) }
                }
            }
            item { Spacer(Modifier.height(24.dp)) }
            item { SectionHeader("Top Players") }
            items(players) { PlayerRow(it) }
        }
    }
}

@Composable
fun TopBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(horizontal = 20.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text("Crick7", fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = Green)
            Text("Live Cricket Scores", fontSize = 13.sp, color = TextGray)
        }
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(Green),
            contentAlignment = Alignment.Center
        ) {
            Text("🔔", fontSize = 18.sp)
        }
    }
}

@Composable
fun FeaturedMatch(match: Match) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Brush.linearGradient(listOf(Green, Color(0xFF2E7D32))))
            .padding(20.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (match.isLive) {
                    LiveBadge()
                }
                Text("ODI • Match 12", fontSize = 12.sp, color = Color.White.copy(alpha = 0.7f))
            }
            Spacer(Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TeamScore(match.flag1, match.team1, match.score1)
                Text("VS", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Accent)
                TeamScore(match.flag2, match.team2, match.score2)
            }
            Spacer(Modifier.height(16.dp))
            Text(
                match.status,
                fontSize = 12.sp,
                color = Accent,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
fun TeamScore(flag: String, name: String, score: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(flag, fontSize = 32.sp)
        Spacer(Modifier.height(4.dp))
        Text(name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Text(score, fontSize = 13.sp, color = Color.White.copy(alpha = 0.85f))
    }
}

@Composable
fun LiveBadge() {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Color.Red)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(Color.White)
        )
        Text("LIVE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
fun SectionHeader(title: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark)
        Text("See all", fontSize = 13.sp, color = LightGreen, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun MatchCard(match: Match) {
    Card(
        modifier = Modifier.width(220.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg),
        elevation = CardDefaults.cardElevation(0.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("ODI", fontSize = 11.sp, color = TextGray)
                if (match.isLive) {
                    Text("● LIVE", fontSize = 11.sp, color = Color.Red, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(10.dp))
            MatchTeamRow(match.flag1, match.team1, match.score1)
            Spacer(Modifier.height(6.dp))
            MatchTeamRow(match.flag2, match.team2, match.score2)
            Spacer(Modifier.height(10.dp))
            Text(match.status, fontSize = 11.sp, color = LightGreen, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun MatchTeamRow(flag: String, name: String, score: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(flag, fontSize = 18.sp)
            Text(name, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
        }
        Text(score, fontSize = 12.sp, color = TextGray)
    }
}

@Composable
fun PlayerRow(player: Player) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(CardBg)
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(Green),
                contentAlignment = Alignment.Center
            ) {
                Text("🏏", fontSize = 20.sp)
            }
            Column {
                Text(player.name, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
                Text(player.role, fontSize = 12.sp, color = TextGray)
            }
        }
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(10.dp))
                .background(Green)
                .padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Text(player.rating, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
