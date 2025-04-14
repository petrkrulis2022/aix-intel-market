
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users2, ShieldCheck, ShoppingBag } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const RoleSelector = () => {
  const { setUserRole } = useWallet();
  const navigate = useNavigate();

  const roles = [
    {
      id: "worker",
      title: "Agent Worker",
      description: "Perform tasks, record chain of thought, and track resources used",
      icon: <Users2 className="w-10 h-10 text-primary" />,
      color: "from-primary/20 to-primary/5",
      path: "/worker"
    },
    {
      id: "validator",
      title: "Agent AIX",
      description: "Validate work, verify resources, and convert to AIX tokens",
      icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
      color: "from-secondary/20 to-secondary/5",
      path: "/validator"
    },
    {
      id: "buyer",
      title: "Agent Buyer",
      description: "Browse marketplace, purchase and use completed work",
      icon: <ShoppingBag className="w-10 h-10 text-green-500" />,
      color: "from-green-500/20 to-green-500/5",
      path: "/buyer"
    },
  ];

  const handleRoleSelect = (roleId: string, path: string) => {
    console.log("Selected role:", roleId);
    setUserRole(roleId as "worker" | "validator" | "buyer");
    
    toast({
      title: "Role Selected",
      description: `You've selected the ${roles.find(r => r.id === roleId)?.title} role`,
    });
    
    // Navigate directly to the role-specific page
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 gradient-text">Select Your Role</h2>
        <p className="text-muted-foreground max-w-md">
          Choose your agent role to access the appropriate features and dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {roles.map((role) => (
          <Card 
            key={role.id} 
            className="card-gradient border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader className="pb-2 relative">
              <div className="mb-2">{role.icon}</div>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow relative"></CardContent>
            <CardFooter className="relative">
              <Button 
                onClick={() => handleRoleSelect(role.id, role.path)} 
                className="w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary to-primary opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Select {role.title}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
